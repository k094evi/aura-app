# ==============================================================================
# FILE: app/services/job_matcher.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This is the ORCHESTRATOR for the "find and score matching jobs" part of
#   the pipeline. Instead of the route/controller layer having to call
#   keyword_extractor, jsearch_client, and job_scorer separately and wire
#   their outputs together, `JobMatcher.match()` does all of that in one
#   call and returns a single, ready-to-use `MatchResult`.
#
#   Full flow this file coordinates:
#
#       ParsedResume
#            │
#            ▼
#     keyword_extractor.extract_keywords()   →  ranked keyword list
#            │
#            ▼
#     JSearchClient.fetch_jobs()             →  raw JobListing objects
#            │
#            ▼
#     JobScorer.score_all() + rank_companies()  →  ScoredJob / CompanyMatch
#            │
#            ▼
#       MatchResult  (returned to the caller — e.g. a route/controller,
#                     which then likely feeds top_jobs into
#                     resume_enricher.enrich_resume_local())
#
# WHAT LIVES HERE:
#   - `MatchResult`  : dataclass bundling everything the caller needs —
#                      the extracted keywords, total job count, the top N
#                      scored jobs, the top N company rankings, and the
#                      full raw (unscored) job list.
#   - `JobMatcher`   : the orchestrator class. Construct it once (it holds
#                      a JSearchClient and tunable limits), then call
#                      `.match(resume)` per resume.
#
# TUNABLE LIMITS (constructor args, with sensible defaults):
#   - top_keywords         : how many keywords to extract from the resume.
#   - results_per_keyword  : how many job results to request per keyword.
#   - max_keywords_queried : how many of the top keywords to actually query
#                             JSearch with (querying fewer, higher-value
#                             keywords keeps API usage down).
#   - top_jobs             : how many top-scored jobs to keep in the result.
#   - top_companies        : how many top-ranked companies to keep.
#
# EDGE CASES HANDLED:
#   If no keywords can be extracted (empty resume content) or JSearch
#   returns no jobs, `match()` short-circuits and returns an empty
#   `MatchResult` rather than letting an error propagate or a scorer run
#   on an empty list.
# ==============================================================================

# app/services/job_matcher.py
"""
Orchestrates the full resume → keywords → JSearch → scored jobs → company ranking pipeline.
"""

import logging
from dataclasses import dataclass, field
from typing import List, Optional

from app.models.schemas import ParsedResume
from app.services.keyword_extractor import extract_keywords, extract_keywords_from_text
from app.services.jsearch_client import JSearchClient, JobListing
from app.services.job_scorer import JobScorer, ScoredJob, CompanyMatch

logger = logging.getLogger(__name__)


@dataclass
class MatchResult:
    keywords:      List[str]
    total_jobs:    int
    top_jobs:      List[ScoredJob]
    top_companies: List[CompanyMatch]
    raw_jobs:      List[JobListing] = field(default_factory=list)


class JobMatcher:

    def __init__(
        self,
        api_key:              Optional[str] = None,
        top_keywords:         int = 15,
        results_per_keyword:  int = 10,
        max_keywords_queried: int = 5,
        top_jobs:             int = 20,
        top_companies:        int = 10,
    ):
        self.client               = JSearchClient(api_key=api_key)
        self.top_keywords         = top_keywords
        self.results_per_keyword  = results_per_keyword
        self.max_keywords_queried = max_keywords_queried
        self._top_jobs            = top_jobs
        self._top_companies       = top_companies

    def match(
        self,
        resume: ParsedResume,
        target_job_description: str = "",
        target_companies: Optional[List[str]] = None,
    ) -> MatchResult:
        """
        PUBLIC ENTRY POINT — runs the full extract-keywords -> fetch-jobs ->
        score-jobs -> rank-companies pipeline for one resume and returns
        the combined result.

        target_job_description: optional free-text JD the user pasted in
            on the upload form. When present, its keywords are merged
            ahead of the resume's own keywords (it's a more precise
            statement of what the user wants than anything we can infer
            from their resume alone), and JobScorer blends overlap
            against it into each job's keyword score.
        target_companies: optional list of company names the user is
            specifically interested in. Used to (a) add a few
            company-steered search queries so their listings have a
            chance to surface, and (b) pin/flag those companies in the
            ranked company list.
        """
        target_companies = target_companies or []

        logger.info("Extracting keywords from resume...")
        resume_keywords = extract_keywords(resume, top_n=self.top_keywords)

        jd_keywords: List[str] = []
        if target_job_description:
            logger.info("Extracting keywords from target job description...")
            jd_keywords = extract_keywords_from_text(target_job_description, top_n=10)

        # Merge: JD keywords first (they're the user's explicit statement
        # of the role they want), then resume keywords, deduplicated.
        keywords: List[str] = []
        seen: set[str] = set()
        for kw in jd_keywords + resume_keywords:
            key = kw.lower()
            if key not in seen:
                seen.add(key)
                keywords.append(kw)

        logger.info("Keywords: %s", keywords)

        if not keywords:
            logger.warning("No keywords extracted — returning empty result.")
            return MatchResult(keywords=[], total_jobs=0, top_jobs=[], top_companies=[])

        # Base search terms: the merged, ranked keyword list.
        search_terms = list(keywords[:self.max_keywords_queried])

        # Add a few company-steered queries so listings from the user's
        # named target companies have a real chance of showing up, even
        # if "software engineer" alone wouldn't have surfaced them.
        top_term = jd_keywords[0] if jd_keywords else (resume_keywords[0] if resume_keywords else None)
        if top_term:
            for company in target_companies[:3]:
                company = company.strip()
                if company:
                    search_terms.append(f"{top_term} {company}")

        logger.info("Fetching jobs from JSearch...")
        jobs = self.client.fetch_jobs(
            keywords=search_terms,
            results_per_keyword=self.results_per_keyword,
            max_keywords=len(search_terms),
        )

        if not jobs:
            logger.warning("No jobs returned from JSearch.")
            return MatchResult(keywords=keywords, total_jobs=0, top_jobs=[], top_companies=[], raw_jobs=[])

        logger.info("Scoring %d jobs against resume...", len(jobs))
        scorer      = JobScorer(resume=resume, keywords=keywords, target_description=target_job_description)
        scored_jobs = scorer.score_all(jobs)
        companies   = scorer.rank_companies(
            scored_jobs,
            top_n=self._top_companies,
            target_companies=target_companies,
        )

        return MatchResult(
            keywords      = keywords,
            total_jobs    = len(jobs),
            top_jobs      = scored_jobs[:self._top_jobs],
            top_companies = companies,
            raw_jobs      = jobs,
        )