# ==============================================================================
# FILE: app/services/jsearch_client.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This is the HTTP client that talks to the external JSearch API (a job
#   listings search API accessed through RapidAPI) and turns its raw JSON
#   response into clean, typed `JobListing` objects the rest of the app can
#   use without worrying about the API's response quirks.
#
#   It sits in the pipeline like this:
#       resume_parser.py  -->  keyword_extractor.py  -->  jsearch_client.py
#       (extract resume     (turn resume into a list    (use those keywords
#        text)                of search keywords)         to fetch real job
#                                                           listings)
#
#   Later, resume_enricher.py uses those job listings (as `top_jobs`) to
#   score how well the resume's language matches what real job postings
#   are asking for.
#
# WHAT LIVES HERE:
#   - `JobListing`   : a dataclass describing one normalized job result.
#   - `JSearchClient`: the class that actually performs the API calls.
#       - `fetch_jobs(keywords)` is the main entry point other files call.
#       - `_get(query)` performs one raw HTTP GET against JSearch.
#       - `_extract_job_list(...)` defensively unwraps JSearch's response,
#         since the same endpoint has been observed returning the job list
#         in different shapes depending on the query/plan (see its
#         docstring below for the specific bug this guards against).
#       - `_parse_job(...)` converts one raw JSearch job dict into a
#         `JobListing`.
#
# CONFIGURATION:
#   - Requires the `JSEARCH_API_KEY` environment variable (RapidAPI key).
#     The client raises `ValueError` at construction time if it's missing.
#   - Results are biased toward Philippines/Manila/Remote-Philippines via
#     `LOCATION_TERMS`, since that's this app's target market.
# ==============================================================================

# app/services/jsearch_client.py
"""
JSearch API client (via RapidAPI) for fetching job listings.
Endpoint: /search-v2
"""

import os
import logging
import urllib.request
import urllib.parse
import json
from dataclasses import dataclass, field
from typing import List, Optional

logger = logging.getLogger(__name__)

JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com/search-v2"
DEFAULT_RESULTS  = 10
MAX_KEYWORDS     = 5

# Location terms appended to every query to bias results
# toward Philippines and nearby remote-friendly markets
LOCATION_TERMS = ["Philippines", "Manila", "Remote Philippines"]

# Keys under which the actual job array might be nested if
# JSearch returns "data" as an object instead of a bare list.
# (search-v2 has been observed to wrap results this way for
# some queries/plans, unlike the plain /search endpoint.)
_NESTED_LIST_KEYS = ("jobs", "results", "data", "items")


@dataclass
class JobListing:
    job_id:           str
    title:            str
    company:          str
    location:         str
    description:      str
    salary_min:       Optional[float]
    salary_max:       Optional[float]
    url:              str
    category:         str
    keywords_matched: List[str] = field(default_factory=list)


class JSearchClient:

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("JSEARCH_API_KEY", "")
        if not self.api_key:
            raise ValueError("JSEARCH_API_KEY is not set.")

    def _get(self, query: str) -> list:
        params = urllib.parse.urlencode({
            "query":       query,
            "num_pages":   "1",
            "date_posted": "all",
        })
        url = f"{JSEARCH_BASE_URL}?{params}"
        logger.debug("GET %s", url)

        req = urllib.request.Request(url, headers={
            "Content-Type":    "application/json",
            "x-rapidapi-key":  self.api_key,
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
        })
        # 30s timeout — JSearch can be slow from Southeast Asia
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode())
            return self._extract_job_list(payload, query)

    @staticmethod
    def _extract_job_list(payload: dict, query: str) -> list:
        """
        Normalizes the JSearch response into a plain list of job dicts.

        search-v2 has been observed to return `data` as either:
          - a bare list of job dicts (the expected/original shape), or
          - a dict wrapping the actual list under a key like
            "jobs" / "results" / "data" / "items".

        Indexing a dict with a slice (e.g. some_dict[:10]) raises
        `KeyError: slice(...)` on Python 3.12+ rather than a TypeError,
        which is what originally surfaced as a 500 here — so we
        defensively unwrap before returning.
        """
        if not isinstance(payload, dict):
            logger.warning(
                "JSearch response for '%s' was not a dict (got %s) — skipping.",
                query, type(payload).__name__,
            )
            return []

        result = payload.get("data", [])

        if isinstance(result, list):
            return result

        if isinstance(result, dict):
            logger.warning(
                "JSearch 'data' for '%s' was a dict, not a list. Keys: %s",
                query, list(result.keys()),
            )
            for key in _NESTED_LIST_KEYS:
                nested = result.get(key)
                if isinstance(nested, list):
                    logger.info(
                        "Recovered job list for '%s' from nested key '%s'.",
                        query, key,
                    )
                    return nested
            logger.warning(
                "Could not locate a job list inside 'data' for '%s' — returning empty.",
                query,
            )
            return []

        logger.warning(
            "JSearch 'data' for '%s' was type %s — expected list or dict. Returning empty.",
            query, type(result).__name__,
        )
        return []

    @staticmethod
    def _parse_job(raw: dict, keyword: str) -> JobListing:
        city     = raw.get("job_city") or ""
        state    = raw.get("job_state") or ""
        country  = raw.get("job_country") or ""
        location = ", ".join(filter(None, [city, state, country])) or "Philippines"

        salary_min = raw.get("job_min_salary")
        salary_max = raw.get("job_max_salary")
        url = raw.get("job_apply_link") or raw.get("job_google_link") or ""

        return JobListing(
            job_id      = raw.get("job_id", ""),
            title       = raw.get("job_title", "").strip(),
            company     = raw.get("employer_name", "Unknown").strip(),
            location    = location,
            description = (raw.get("job_description") or "")[:500].strip(),
            salary_min  = float(salary_min) if salary_min else None,
            salary_max  = float(salary_max) if salary_max else None,
            url         = url,
            category    = raw.get("job_employment_type") or "Full-time",
            keywords_matched = [keyword],
        )

    def fetch_jobs(
        self,
        keywords:            List[str],
        results_per_keyword: int = DEFAULT_RESULTS,
        max_keywords:        int = MAX_KEYWORDS,
    ) -> List[JobListing]:
        """
        Main entry point for this file — this is the method other modules
        (e.g. the enrichment pipeline) actually call.

        Queries JSearch for each keyword paired with a location term.
        Rotates through LOCATION_TERMS so we get Philippines, Manila,
        and Remote results across queries.
        """
        # `seen` de-duplicates jobs by job_id across multiple keyword
        # queries. If the same job shows up for two different keywords,
        # we don't want it twice in the results — instead we just record
        # that it matched both keywords (see keywords_matched below).
        seen: dict[str, JobListing] = {}
        top_kw = keywords[:max_keywords]

        for i, kw in enumerate(top_kw):
            # Rotate location term per keyword
            location = LOCATION_TERMS[i % len(LOCATION_TERMS)]
            query = f"{kw} {location}"
            logger.info("Querying JSearch: '%s'", query)
            try:
                results = self._get(query)
            except Exception as exc:
                logger.warning("JSearch query failed for '%s': %s", kw, exc)
                continue

            if not isinstance(results, list):
                # Belt-and-suspenders: _get should already guarantee a list,
                # but never let a bad shape crash the whole request.
                logger.warning(
                    "Unexpected results type for '%s': %s — skipping.",
                    kw, type(results).__name__,
                )
                continue

            for raw in results[:results_per_keyword]:
                if not isinstance(raw, dict):
                    logger.warning("Skipping non-dict job entry for '%s': %r", kw, raw)
                    continue
                jid = raw.get("job_id", "")
                if jid in seen:
                    if kw not in seen[jid].keywords_matched:
                        seen[jid].keywords_matched.append(kw)
                else:
                    seen[jid] = self._parse_job(raw, kw)

        jobs = list(seen.values())
        logger.info("Fetched %d unique jobs from JSearch", len(jobs))
        return jobs