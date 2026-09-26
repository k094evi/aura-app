# app/services/jsearch_client.py
"""
JSearch API client (via RapidAPI) for fetching job listings.
Endpoint: /search-v2
"""

import os
import time
import threading
import logging
import urllib.request
import urllib.parse
import urllib.error
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import List, Optional

logger = logging.getLogger(__name__)

JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com/search-v2"
DEFAULT_RESULTS  = 10
MAX_KEYWORDS     = 5

# search-v2's `country` param defaults to "us" server-side whenever it's
# omitted (per JSearch docs: "this parameter must be set in order to get
# jobs in a specific country"). Previously this client never sent it and
# instead appended "Philippines"/"Remote Philippines" as plain text onto
# the query string, hoping Google-for-Jobs' free-text parser would infer
# location from that. It doesn't override the server-side country filter
# — every request was silently being scoped to US jobs regardless of the
# text hint, which is why match quality/coverage looked bad. `country`
# below is sent as an explicit request param instead (ISO 3166-1 alpha-2).
COUNTRY_CODE = "ph"

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

    # ── Rate limiting ─────────────────────────────────────────────
    # fetch_jobs() fires up to `max_keywords` queries concurrently via a
    # thread pool, which used to mean every /api/analyze call sent a
    # burst of simultaneous requests to RapidAPI — reliably tripping its
    # per-second rate limit and coming back as HTTP 429 for every query,
    # every time. These are class-level (shared across threads/instances
    # within a process) so the burst gets spaced out instead of firing
    # all at once, and a 429 gets retried with backoff instead of just
    # being dropped.
    _rate_lock = threading.Lock()
    _last_request_time = 0.0
    _MIN_REQUEST_INTERVAL = 0.5  # seconds between outgoing requests
    _MAX_RETRIES = 2
    _BASE_BACKOFF = 1.5  # seconds, doubled per retry attempt

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("JSEARCH_API_KEY", "")
        if not self.api_key:
            raise ValueError("JSEARCH_API_KEY is not set.")

    @classmethod
    def _throttle(cls):
        """Block just long enough to keep requests spaced out, even
        when called concurrently from multiple threads."""
        with cls._rate_lock:
            now = time.monotonic()
            wait = cls._last_request_time + cls._MIN_REQUEST_INTERVAL - now
            if wait > 0:
                time.sleep(wait)
            cls._last_request_time = time.monotonic()

    def _get(self, query: str, work_from_home: bool = False) -> list:
        params = urllib.parse.urlencode({
            "query":          query,
            "num_pages":      "1",
            "date_posted":    "all",
            "country":        COUNTRY_CODE,
            "work_from_home": "true" if work_from_home else "false",
        })
        url = f"{JSEARCH_BASE_URL}?{params}"
        logger.debug("GET %s", url)

        req = urllib.request.Request(url, headers={
            "Content-Type":    "application/json",
            "x-rapidapi-key":  self.api_key,
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
        })

        for attempt in range(self._MAX_RETRIES + 1):
            self._throttle()
            try:
                # 30s timeout — JSearch can be slow from Southeast Asia
                with urllib.request.urlopen(req, timeout=30) as resp:
                    payload = json.loads(resp.read().decode())
                    return self._extract_job_list(payload, query)
            except urllib.error.HTTPError as e:
                if e.code == 429 and attempt < self._MAX_RETRIES:
                    retry_after = e.headers.get("Retry-After") if e.headers else None
                    delay = float(retry_after) if retry_after else self._BASE_BACKOFF * (2 ** attempt)
                    logger.warning(
                        "JSearch rate-limited for '%s' — retrying in %.1fs (attempt %d/%d)",
                        query, delay, attempt + 1, self._MAX_RETRIES,
                    )
                    time.sleep(delay)
                    continue
                raise

        return []

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
        Queries JSearch for each keyword, scoped to COUNTRY_CODE via the
        API's own `country` param (see the note on COUNTRY_CODE above —
        this used to be attempted via a text suffix on the query, which
        didn't actually filter anything). Alternates each keyword between
        an on-site/hybrid search and a `work_from_home=true` search so we
        get both local and remote-eligible results per keyword, instead
        of burning a second full query slot per keyword the way the old
        text-suffix rotation did.
        """
        seen: dict[str, JobListing] = {}
        top_kw = keywords[:max_keywords]

        # Each keyword hits JSearch as a separate blocking HTTP call (up to
        # 30s each per the timeout in _get()). Running these one-after-
        # another in a for-loop meant /api/analyze could take 5x a single
        # call's latency (we saw 18-28s end-to-end in practice) — the
        # frontend's "rendering" step wasn't slow, it was just still
        # waiting on this loop to finish. Firing all requests at once via
        # a thread pool collapses that to roughly the slowest single call.
        queries = [
            (kw, kw, i % 2 == 1)  # alternate: on-site, remote, on-site, remote...
            for i, kw in enumerate(top_kw)
        ]

        with ThreadPoolExecutor(max_workers=max(1, len(queries))) as pool:
            future_to_kw = {
                pool.submit(self._get, query, wfh): kw
                for kw, query, wfh in queries
            }

            for future in as_completed(future_to_kw):
                kw = future_to_kw[future]
                logger.info("Querying JSearch: '%s'", kw)
                try:
                    results = future.result()
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