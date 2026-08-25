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
from app.services.keyword_extractor import extract_keywords
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

    def match(self, resume: ParsedResume) -> MatchResult:
        """
        PUBLIC ENTRY POINT — runs the full extract-keywords -> fetch-jobs ->
        score-jobs -> rank-companies pipeline for one resume and returns
        the combined result.
        """
        logger.info("Extracting keywords from resume...")
        keywords = extract_keywords(resume, top_n=self.top_keywords)
        logger.info("Keywords: %s", keywords)

        if not keywords:
            logger.warning("No keywords extracted — returning empty result.")
            return MatchResult(keywords=[], total_jobs=0, top_jobs=[], top_companies=[])

        logger.info("Fetching jobs from JSearch...")
        jobs = self.client.fetch_jobs(
            keywords=keywords,
            results_per_keyword=self.results_per_keyword,
            max_keywords=self.max_keywords_queried,
        )

        if not jobs:
            logger.warning("No jobs returned from JSearch.")
            return MatchResult(keywords=keywords, total_jobs=0, top_jobs=[], top_companies=[], raw_jobs=[])

        logger.info("Scoring %d jobs against resume...", len(jobs))
        scorer      = JobScorer(resume=resume, keywords=keywords)
        scored_jobs = scorer.score_all(jobs)
        companies   = scorer.rank_companies(scored_jobs, top_n=self._top_companies)

        return MatchResult(
            keywords      = keywords,
            total_jobs    = len(jobs),
            top_jobs      = scored_jobs[:self._top_jobs],
            top_companies = companies,
            raw_jobs      = jobs,
        )