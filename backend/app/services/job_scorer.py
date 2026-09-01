# FILE LOCATION: app/services/job_scorer.py
"""
PURPOSE
-------
This module scores each job listing pulled from the job-search API
against a user's parsed resume, then ranks companies based on those
scores. It's the "matching engine" that turns a raw list of job
postings into a ranked list of "how well does this job fit this
resume?" results.

NOTE ON NAMING: the module docstring below (original, unmodified)
refers to "jsearch job listing", but the actual import is
`JobListing` from `app.services.jsearch_client` — so at the time this
was written the job data source may have been swapped from Adzuna to
JSearch without the docstring being updated. Worth double-checking
which API is actually in use if this causes confusion later.

Scoring breakdown (totals 100 pts):
  ┌──────────────────────────────────────┬────────┐
  │ Component                            │ Weight │
  ├──────────────────────────────────────┼────────┤
  │ Keyword overlap (resume → job desc)  │  40 %  │
  │ Skills match (skills_block → title   │  35 %  │
  │   + description)                     │        │
  │ Keywords matched across API queries  │  15 %  │
  │ Title relevance (summary keywords)   │  10 %  │
  └──────────────────────────────────────┴────────┘

No BERT needed at this phase — pure TF-IDF + set intersection.
BERT similarity will replace/supplement this in the next phase.

HOW IT FITS INTO THE PROGRAM
-----------------------------
- Takes a `ParsedResume` (from `app.models.schemas`, presumably built
  by the resume-parsing step elsewhere in the app) and a list of
  `JobListing` objects (from `app.services.jsearch_client`, i.e. the
  job-search API client).
- Produces `ScoredJob` objects (one per listing) and can further roll
  those up into `CompanyMatch` objects (one per company, aggregating
  all of that company's scored jobs).
- Downstream code (likely an API route or UI layer) is expected to
  call `JobScorer(resume, keywords).score_all(jobs)` to get a ranked
  list of jobs, and/or `JobScorer.rank_companies(...)` to get a
  ranked list of companies.

SCORING METHOD (in plain terms)
---------------------------------
This is intentionally simple, keyword/set-based matching (not a
machine-learning similarity model) — see the "No BERT needed" note
above. Each of the 4 components independently produces a 0-to-max
score, and they're summed for a 0-100 total:
  1. Keyword overlap  (0-40) — raw text-vs-text token overlap.
  2. Skills match      (0-35) — explicit skills list vs job text.
  3. API match          (0-15) — how many of the search keywords used
                                  to originally find this job actually
                                  matched it.
  4. Title relevance    (0-10) — resume summary/skills vs job title.
"""

import re
from dataclasses import dataclass, field
from typing import List, Dict, Optional

from app.models.schemas import ParsedResume
from app.services.jsearch_client import JobListing


# ─────────────────────────────────────────────
# RESULT MODEL
# ─────────────────────────────────────────────

@dataclass
class ScoredJob:
    """A single job listing plus its computed score breakdown."""
    job:              JobListing
    total_score:      float          # 0–100
    keyword_score:    float          # 0–40
    skills_score:     float          # 0–35
    api_match_score:  float          # 0–15
    title_score:      float          # 0–10
    matched_skills:   List[str] = field(default_factory=list)
    matched_keywords: List[str] = field(default_factory=list)


@dataclass
class CompanyMatch:
    """Aggregated scoring for all of a single company's job listings."""
    company:          str
    avg_score:        float
    top_score:        float
    job_count:        int
    top_job:          ScoredJob
    all_jobs:         List[ScoredJob] = field(default_factory=list)
    # True if this company's name matched one of the user's requested
    # target companies. Doesn't affect the underlying score — used only
    # to pin/flag the company so target-company picks aren't buried
    # under higher-scoring companies the user never asked about.
    targeted:         bool = False


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def _normalize(text: str) -> set:
    """Lowercase token set from a string, 3+ char alphanum tokens only.

    Used to turn free-form text (resume text, job descriptions/titles)
    into a comparable "bag of words" set for overlap calculations.
    Allows +, #, and . inside tokens so things like "c++", "c#", and
    "node.js" survive as single tokens instead of being split apart.
    """
    return set(re.findall(r"[a-z][a-z0-9\+\#\.]{2,}", text.lower()))


def _skill_tokens(skills_block: str) -> List[str]:
    """Split skills block into individual skill strings (preserves multi-word).

    Unlike `_normalize`, this keeps multi-word skills (e.g. "project
    management") intact as single list entries, splitting only on
    common delimiters (commas, pipes, bullets, newlines, slashes).
    """
    parts = re.split(r"[,|•\n/]+", skills_block)
    return [p.strip().lower() for p in parts if p.strip() and len(p.strip()) > 1]


# ─────────────────────────────────────────────
# SCORER
# ─────────────────────────────────────────────

class JobScorer:
    """Scores and ranks job listings against a single parsed resume."""

    def __init__(
        self,
        resume: ParsedResume,
        keywords: List[str],
        target_description: Optional[str] = None,
    ):
        self.resume   = resume
        self.keywords = [kw.lower() for kw in keywords]

        # Pre-compute resume token sets once so each per-job scoring
        # call below doesn't have to redo this work.
        self.resume_tokens  = _normalize(resume.raw_text)
        self.skills_list    = _skill_tokens(resume.skills_block or "")
        self.skills_tokens  = _normalize(resume.skills_block or "")
        self.summary_tokens = _normalize(resume.summary_block or "")

        # Optional user-pasted target job description. When present, the
        # keyword component below blends resume-overlap with overlap
        # against this specific JD, so a job listing that actually
        # matches what the user says they're targeting outscores one
        # that only happens to echo their resume's own wording.
        self.target_description = target_description or ""
        self.target_tokens = _normalize(self.target_description)

    # ── Component scores ─────────────────────

    def _keyword_score(self, job: JobListing) -> tuple[float, List[str]]:
        """
        40 pts — how many resume (and, if given, target-JD) tokens appear
        in the job description.

        Without a target job description: 100% of this component (40 pts)
        comes from resume-vs-job overlap, same as before.

        With a target job description: split 25 pts resume-overlap /
        15 pts target-JD-overlap, so a listing that matches the role the
        user is actually going after outweighs one that only echoes
        their resume's general vocabulary.
        """
        job_tokens = _normalize(job.description + " " + job.title)
        if not job_tokens:
            return 0.0, []

        resume_matched = self.resume_tokens & job_tokens
        resume_ratio = len(resume_matched) / max(len(self.resume_tokens), 1)

        if not self.target_tokens:
            score = min(resume_ratio * 200, 40.0)
            return round(score, 2), sorted(resume_matched)[:10]

        target_matched = self.target_tokens & job_tokens
        target_ratio = len(target_matched) / max(len(self.target_tokens), 1)

        resume_score = min(resume_ratio * 125, 25.0)   # ~20% overlap = full 25
        target_score = min(target_ratio * 100, 15.0)   # ~15% overlap = full 15
        score = round(resume_score + target_score, 2)

        matched = sorted(resume_matched | target_matched)[:10]
        return score, matched

    def _skills_score(self, job: JobListing) -> tuple[float, List[str]]:
        """
        35 pts — explicit skills from skills_block found in job title + description.
        Each matched skill = 35 / total_skills pts, capped at 35.
        """
        if not self.skills_list:
            return 0.0, []

        job_text = (job.title + " " + job.description).lower()
        # Simple substring check — is this skill phrase present anywhere
        # in the combined title+description text?
        matched = [s for s in self.skills_list if s in job_text]
        ratio = len(matched) / max(len(self.skills_list), 1)
        score = min(ratio * 35, 35.0)
        return round(score, 2), matched

    def _api_match_score(self, job: JobListing) -> float:
        """
        15 pts — how many of the queried keywords matched this job via jsearch.
        (keywords_matched is populated by the jsearch during dedup.)
        """
        if not self.keywords:
            return 0.0
        # Denominator is capped at the first 5 keywords, so searches
        # with many keywords don't unfairly dilute this component.
        ratio = len(job.keywords_matched) / max(len(self.keywords[:5]), 1)
        return round(min(ratio * 15, 15.0), 2)

    def _title_score(self, job: JobListing) -> float:
        """
        10 pts — how many summary/experience keywords appear in the job title.
        """
        title_tokens = _normalize(job.title)
        # Combines both the resume's summary tokens AND skills tokens
        # into one set before comparing against the job title.
        overlap = (self.summary_tokens | self.skills_tokens) & title_tokens
        ratio = len(overlap) / max(len(title_tokens), 1)
        score = min(ratio * 30, 10.0)
        return round(score, 2)

    # ── Score a single job ───────────────────

    def score_job(self, job: JobListing) -> ScoredJob:
        """Runs all 4 scoring components for one job and sums them into a total."""
        kw_score,  matched_kw     = self._keyword_score(job)
        sk_score,  matched_skills = self._skills_score(job)
        api_score                 = self._api_match_score(job)
        ti_score                  = self._title_score(job)

        total = round(kw_score + sk_score + api_score + ti_score, 2)

        return ScoredJob(
            job             = job,
            total_score     = total,
            keyword_score   = kw_score,
            skills_score    = sk_score,
            api_match_score = api_score,
            title_score     = ti_score,
            matched_skills  = matched_skills,
            matched_keywords= matched_kw,
        )

    # ── Score all jobs ───────────────────────

    def score_all(self, jobs: List[JobListing]) -> List[ScoredJob]:
        """Scores every job in the list and returns them sorted best-first."""
        scored = [self.score_job(j) for j in jobs]
        return sorted(scored, key=lambda s: s.total_score, reverse=True)

    # ── Aggregate to company ranking ─────────

    @staticmethod
    def rank_companies(
        scored_jobs: List[ScoredJob],
        top_n: int = 10,
        target_companies: Optional[List[str]] = None,
    ) -> List[CompanyMatch]:
        """
        Groups scored jobs by company.
        Company score = weighted average: 60% top_score + 40% avg_score

        If target_companies is given (the companies the user explicitly
        said they're interested in), those companies are:
          - flagged via CompanyMatch.targeted, and
          - guaranteed a slot in the returned top_n list, sorted ahead of
            non-targeted companies regardless of score — the user asked
            about them by name, so they shouldn't get crowded out by an
            unrelated company that merely scored a few points higher.
        Companies the user targeted but for which no jobs were found at
        all simply won't appear here (there's nothing to show); that's
        expected since this only aggregates from scored_jobs.
        """
        target_set = {c.strip().lower() for c in (target_companies or []) if c.strip()}

        # Group all scored jobs under their company name. Jobs with a
        # blank/missing company name are bucketed under "Unknown".
        by_company: Dict[str, List[ScoredJob]] = {}
        for sj in scored_jobs:
            name = sj.job.company.strip() or "Unknown"
            by_company.setdefault(name, []).append(sj)

        companies = []
        for company, jobs in by_company.items():
            scores   = [j.total_score for j in jobs]
            avg      = sum(scores) / len(scores)
            top      = max(scores)
            best_job = max(jobs, key=lambda j: j.total_score)

            companies.append(CompanyMatch(
                company   = company,
                avg_score = round(avg, 2),
                top_score = round(top, 2),
                job_count = len(jobs),
                top_job   = best_job,
                all_jobs  = sorted(jobs, key=lambda j: j.total_score, reverse=True),
                targeted  = company.strip().lower() in target_set,
            ))

        # Sort by: targeted companies first, then the existing weighted
        # score formula (60% top_score + 40% avg_score) descending.
        companies.sort(
            key=lambda c: (c.targeted, 0.6 * c.top_score + 0.4 * c.avg_score),
            reverse=True,
        )
        return companies[:top_n]