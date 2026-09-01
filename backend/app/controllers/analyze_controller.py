# ============================================================================
# FILE LOCATION : app/controllers/analyze_controller.py
# ============================================================================
# PURPOSE:
#   Coordinates the full "resume analysis" workflow behind the
#   POST /api/analyze endpoint:
#     1. Validate the uploaded resume file.
#     2. Parse it into structured data (resume_parser).
#     3. Match it against available jobs (JobMatcher).
#     4. Run local enrichment/ATS scoring (resume_enricher).
#     5. Reshape all of that into the exact JSON structure the frontend
#        expects (field names, truncated descriptions, formatted salary
#        strings, etc.).
#
#   Per the module's own docstring: this logic used to live directly
#   inside the route function in main.py, but was pulled out here
#   because shaping "top companies" into frontend-friendly fields
#   (match %, team size copy, requirements list) is business/presentation
#   logic — not HTTP request/response handling — and is easier to unit
#   test as a plain async function than as part of a FastAPI endpoint.
#
# HOW IT FITS INTO THE PROGRAM:
#   - A FastAPI route (e.g. `@router.post("/api/analyze")` in some routes
#     file) receives the multipart upload + form fields and simply calls
#     `handle_analyze(...)` from here, then returns whatever dict it gets
#     back as the JSON response.
#   - This controller does NOT talk to the database or external APIs
#     directly — it orchestrates calls to services:
#       * app.services.resume_parser.parse_resume   -> extract resume text/sections
#       * app.services.job_matcher.JobMatcher        -> match resume to jobs (JSearch API)
#       * app.services.resume_enricher.enrich_resume_local -> ATS score, strengths, gaps
#   - Errors from each stage are caught and converted into appropriate
#     HTTPExceptions (400 bad file type, 422 unparsable file, 503 job
#     matching config issue, 500 for anything unexpected), so the route
#     itself stays free of try/except clutter.
#
# ENV VARS USED:
#   - JSEARCH_API_KEY : passed to JobMatcher; if missing, JobMatcher raises
#     ValueError and this file responds with 503 (a config problem, not
#     something caused by the user's uploaded file).
#
# ERROR-HANDLING NOTE (added after a bug where corrupted/malformed
# uploads produced a raw, non-JSON "Internal Server Error" instead of a
# clean response):
#   Every stage that can plausibly throw is now wrapped in its own
#   try/except so nothing can escape this function uncaught. An uncaught
#   exception skips FastAPI's HTTPException JSON handling entirely and
#   falls through to Starlette's default 500 page, which is plain text —
#   that's what breaks JSON.parse() on the frontend proxy. Catching
#   broadly here (not just ValueError) and always raising HTTPException
#   guarantees the frontend always gets valid JSON back, and
#   logger.exception(...) still prints the real traceback server-side
#   for debugging.
#
# BUGFIX (this revision):
#   main.py's route calls `handle_analyze(file, target_job,
#   target_companies, user_id=user.id)`, but this function's signature
#   didn't accept a `user_id` keyword argument. That mismatch raised a
#   TypeError at the call site in main.py — BEFORE this function body
#   (and all its careful try/except handling) ever ran. Because it
#   happened outside of any try/except, it fell straight through to
#   Starlette's default plain-text 500 handler instead of a clean JSON
#   error, which is what broke the frontend proxy's JSON.parse().
#   Fixed by accepting `user_id` here. Note: the module docstring
#   referenced a `_persist_parsed_resume` step that would use user_id to
#   attribute a saved resume row to the requesting user — that function
#   doesn't exist in this file yet, so persistence is NOT implemented
#   here. user_id is accepted and returned in the response for now;
#   wire up real persistence when that's ready.
# ============================================================================

"""
Coordinates the /api/analyze flow: validates the upload, calls the
parsing/matching/enrichment services, and shapes their output into the
JSON the frontend expects.

This used to live directly inside the route function in main.py. Moved
here because: shaping "top companies" into frontend-friendly fields
(match %, team size copy, requirements list) is business/presentation
logic, not HTTP handling — it doesn't belong in the route, and it's
easier to unit test as a plain function than as part of a FastAPI
endpoint.
"""

import json
import os

from fastapi import HTTPException, UploadFile

from app.services.resume_parser import parse_resume
from app.services.job_matcher import JobMatcher
from app.services.resume_enricher import enrich_resume_local
from app.services.target_job_matcher import calculate_target_job_gap
from app.utils.logger import logger

# Only these upload content-types are accepted for resumes.
ALLOWED_RESUME_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # .docx
    "application/msword",  # legacy .doc
}


# ----------------------------------------------------------------------------
# _format_salary
# Turns a job dict's salary_min/salary_max into a human-readable string
# for display on the frontend, e.g.:
#   min & max present -> "$60,000 – $90,000"
#   only min present  -> "From $60,000"
#   neither present   -> "Not disclosed"
# ----------------------------------------------------------------------------
def _format_salary(job: dict) -> str:
    lo = job.get("salary_min")
    hi = job.get("salary_max")
    if lo and hi:
        return f"${int(lo):,} – ${int(hi):,}"
    if lo:
        return f"From ${int(lo):,}"
    return "Not disclosed"


# ----------------------------------------------------------------------------
# _shape_top_jobs
# Converts the raw "scored job" objects returned by JobMatcher into plain
# dicts with only the fields the frontend needs. Notably truncates the
# job description to 300 characters to keep the payload light (full
# description isn't needed for the summary/list view).
# ----------------------------------------------------------------------------
def _shape_top_jobs(top_jobs: list) -> list[dict]:
    return [
        {
            "title":          sj.job.title,
            "company":        sj.job.company,
            "location":       sj.job.location,
            "url":            sj.job.url,
            "total_score":    sj.total_score,
            "matched_skills": sj.matched_skills,
            "description":    sj.job.description[:300],
            "salary_min":     sj.job.salary_min,
            "salary_max":     sj.job.salary_max,
        }
        for sj in top_jobs
    ]


# ----------------------------------------------------------------------------
# _shape_companies
# Builds the "top companies" cards shown on the frontend. For each scored
# company:
#   - Finds that company's jobs among the already-shaped top_jobs list.
#   - Uses up to 4 of those job titles as "requirements" (falls back to a
#     placeholder string if the company has no matched jobs in the list).
#   - Caps the displayed match percentage at 99 (never shows a 100% match).
#   - Pulls location/salary from the company's first matched job, with
#     "Philippines" as a location fallback.
#   - teamSize/jobType/experienceLevel are currently static placeholder
#     copy, not derived from real data — worth knowing if you're chasing
#     down why every company shows "50–500 employees".
# ----------------------------------------------------------------------------
def _shape_companies(top_companies: list, top_jobs_shaped: list) -> list[dict]:
    shaped = []
    for c in top_companies:
        company_jobs = [j for j in top_jobs_shaped if j["company"] == c.company]
        requirements = [j["title"] for j in company_jobs[:4]] or ["See job posting for details"]
        match_pct = min(round(c.top_score), 99)
        reason = f"{c.job_count} matching role{'s' if c.job_count != 1 else ''} found · Avg score {c.avg_score}/100"
        # Flag companies the user explicitly named as a target so they
        # stand out in the carousel even when another company scored higher.
        if getattr(c, "targeted", False):
            reason = f"🎯 One of your target companies · {reason}"
        shaped.append({
            "company":         c.company,
            "match":           match_pct,
            "reason":          reason,
            "location":        company_jobs[0]["location"] if company_jobs else "Philippines",
            "jobType":         "Full-time",
            "experienceLevel": "Mid-Level to Senior",
            "salary":          _format_salary(company_jobs[0] if company_jobs else {}),
            "teamSize":        "50–500 employees",
            "requirements":    requirements,
            "top_job_url":     c.top_job.job.url,
        })
    return shaped


# ----------------------------------------------------------------------------
# handle_analyze  —  the main entry point, called by POST /api/analyze
#
# Step-by-step:
#   1. Reject the upload outright (400) if its content-type isn't one of
#      ALLOWED_RESUME_MIME_TYPES.
#   2. Read the raw file bytes. Any failure here (e.g. client disconnects
#      mid-upload) -> 400.
#   3. Hand the bytes to parse_resume(). A ValueError (bad/unreadable
#      file) -> 422. Any OTHER exception (e.g. pdfplumber/python-docx
#      choking on a malformed file internally, which does NOT always
#      raise ValueError) is now also caught -> 422, instead of escaping
#      uncaught.
#   4. Run the parsed resume through JobMatcher.match():
#        - ValueError (typically: JSEARCH_API_KEY not configured) is a
#          server-side config problem -> 503, logged as an error, and the
#          message makes clear it's not the user's fault.
#        - Any other exception (network failure, bad API response, etc.)
#          is logged with a full traceback via logger.exception, but the
#          client only receives a generic 500 message.
#   5. Reshape the matcher's top_jobs/top_companies into frontend-ready
#      dicts via the helper functions above. Now wrapped in try/except
#      too, since malformed job data could throw here as well.
#   6. Run local enrichment (ATS scoring, strengths, gaps, grammar) via
#      enrich_resume_local(). Any unexpected exception here -> 500.
#   7. Assemble and return the final response dict combining matching +
#      enrichment results.
#
# Returns a plain dict (not a Pydantic model) — the calling route is
# expected to return this directly as the JSON response body.
#
# user_id: the verified caller's id (from get_current_user in main.py).
#   Currently only echoed back in the response — no persistence happens
#   here yet. See the BUGFIX note at the top of this file.
# ----------------------------------------------------------------------------
async def handle_analyze(
    file: UploadFile,
    target_job: str,
    target_companies: str,
    job_description: str = "",
    user_id: str | None = None,
) -> dict:
    """
    Called by POST /api/analyze.
    1. Validates the upload's content type.
    2. Parses the resume, matches it against jobs, runs enrichment/ATS scoring
       — steered by the optional target_job / job_description / target_companies
       the user supplied on the upload form.
    3. Shapes everything into the response shape the frontend expects.
    """
    if file.content_type not in ALLOWED_RESUME_MIME_TYPES:
        raise HTTPException(400, "Only PDF and DOCX files are supported.")

    # `target_companies` arrives as a JSON-encoded string (multipart form
    # fields are always strings) — this was previously never actually
    # parsed or used anywhere in this function. A malformed value
    # shouldn't fail the whole analysis, so fall back to an empty list.
    try:
        target_companies_list = json.loads(target_companies) if target_companies else []
        if not isinstance(target_companies_list, list):
            target_companies_list = []
    except (json.JSONDecodeError, TypeError):
        logger.warning("Could not parse target_companies JSON: %r", target_companies)
        target_companies_list = []

    try:
        file_bytes = await file.read()
    except Exception:
        logger.exception("Failed to read uploaded file")
        raise HTTPException(400, "Could not read the uploaded file. Please try again.")

    try:
        parsed = parse_resume(file_bytes, filename=file.filename or "")
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception:
        # pdfplumber/python-docx (and the libraries they depend on) don't
        # always raise ValueError for a malformed/corrupted file — this
        # catch-all makes sure any such failure still becomes a clean 422
        # instead of an uncaught exception that skips FastAPI's JSON error
        # handling and falls through to a raw-text 500.
        logger.exception("Unexpected error while parsing resume file")
        raise HTTPException(
            status_code=422,
            detail="Could not read this file. It may be corrupted or in an unsupported format.",
        )

    try:
        matcher = JobMatcher(api_key=os.getenv("JSEARCH_API_KEY", ""))
        result = matcher.match(
            parsed,
            target_job_description=job_description,
            target_companies=target_companies_list,
        )
    except ValueError as e:
        # Raised by JobMatcher/JSearchClient's constructor when
        # JSEARCH_API_KEY is missing — a config problem, not the user's
        # fault, so don't blame the file they uploaded.
        logger.error("Job matching unavailable: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Job matching is temporarily unavailable. Please try again later.",
        )
    except Exception:
        # Anything unexpected (network, parsing of the API response, etc.)
        # gets logged with full detail server-side, but the client only
        # ever sees a generic message — never a raw traceback.
        logger.exception("Unexpected error during job matching")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analyzing your resume. Please try again.",
        )

    try:
        top_jobs_shaped = _shape_top_jobs(result.top_jobs)
        companies_shaped = _shape_companies(result.top_companies, top_jobs_shaped)
    except Exception:
        logger.exception("Unexpected error while shaping match results")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while formatting your results. Please try again.",
        )

    # target_job is a short role title (e.g. "software engineer") checked
    # against a static per-role skill/certification checklist — separate
    # from job_description (the free-text JD used for job matching above).
    # Returns None for blank/unrecognized titles, in which case
    # enrichment just falls back to its existing job-vocab-based skill
    # gap detection.
    target_job_gap = calculate_target_job_gap(target_job, parsed)

    logger.info("Running local resume enrichment...")
    try:
        enrichment = enrich_resume_local(
            resume=parsed,
            keywords=result.keywords,
            top_jobs=top_jobs_shaped,
            target_job_gap=target_job_gap,
        )
    except Exception:
        logger.exception("Unexpected error during resume enrichment")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while scoring your resume. Please try again.",
        )
    logger.info("Enrichment complete — ATS score: %d", enrichment["ats_score"])

    # TODO: persist the parsed resume (attributed to user_id) once a
    # storage layer for this exists. Not implemented yet — user_id is
    # accepted here so the route call in main.py succeeds, and is echoed
    # back below for now.

    # Final response payload sent back to the frontend.
    return {
        "user_id":        user_id,
        "keywords":       result.keywords,
        "total_jobs":     result.total_jobs,
        "top_jobs":       top_jobs_shaped,
        "companies":      companies_shaped,
        "ats_score":      enrichment["ats_score"],
        "sections":       enrichment["sections"],
        "strengths":      enrichment["strengths"],
        "improvements":   enrichment["improvements"],
        "skill_gaps":     enrichment["skill_gaps"],
        "grammar_issues": enrichment["grammar_issues"],
    }