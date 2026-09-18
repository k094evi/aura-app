# ==============================================================================
# FILE LOCATION: app/controllers/analyze_controller.py
# ==============================================================================
#
# PURPOSE:
#   Coordinates the complete /api/analyze workflow:
#
#       Upload
#          ↓
#       Resume Parser
#          ↓
#       JobMatcher / JSearch
#          ↓
#       Target Job Gap
#          ↓
#       Job-Posting Text Selection (pasted JD -> matched job -> none)
#          ↓
#       Resume Enrichment (skill_gaps: job-posting comparison, else backup)
#          ↓
#       Supabase
#          ↓
#       Frontend JSON
#
#   Important:
#   This controller does NOT invent job/company metadata.
#   Location, job type, experience, salary, and team size are taken from the
#   data available on the matched/raw job objects.
#
# THIS REVISION:
#   Added job-posting-text selection for skill-gap comparison, per the
#   original spec ("AURA should analyze the actual job posting... Matched
#   / Missing"), with a clear priority order:
#     1. The single best-matching real job listing from JSearch
#        (result.top_jobs[0]'s FULL, untruncated description — NOT the
#        500-char-truncated version in top_jobs_shaped, which is
#        display-only).
#     2. Otherwise (JSearch returned nothing — rate-limited, no matches,
#        etc.), no job-posting text is passed to enrich_resume_local at
#        all, and it falls back internally to the pre-existing hardcoded
#        taxonomy (job_requirements.py / SKILL_TAXONOMY) — the "backup
#        result".
#   Note: the user's pasted job_description still steers job matching
#   itself (JobMatcher/JobScorer), it just isn't a skill-gap comparison
#   source on its own.
#   See resume_enricher.py's enrich_resume_local() / _detect_skill_gaps_from_posting()
#   docstrings for the comparison logic itself.
# ==============================================================================

"""
Coordinates the /api/analyze flow.
"""

import json
import os
import re
from typing import Any

from fastapi import HTTPException, UploadFile

from app.extensions.supabase_client import supabase_admin
from app.services.resume_parser import parse_resume
from app.services.job_matcher import JobMatcher
from app.services.resume_enricher import enrich_resume_local
from app.services.target_job_matcher import calculate_target_job_gap
from app.utils.logger import logger


# ==============================================================================
# ALLOWED RESUME FILE TYPES
# ==============================================================================

ALLOWED_RESUME_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


# ==============================================================================
# GENERIC ATTRIBUTE HELPER
# ==============================================================================

def _get_attr(
    obj: Any,
    *names: str,
    default: Any = None,
) -> Any:
    """
    Safely retrieves the first available attribute from an object.

    This makes the controller tolerant of slightly different field names
    between the JobListing model and JSearch's API naming.
    """

    if obj is None:
        return default

    for name in names:

        try:
            value = getattr(obj, name, None)
        except Exception:
            value = None

        if value is not None:
            return value

    # Also support dictionaries if a raw dictionary reaches this layer.
    if isinstance(obj, dict):

        for name in names:

            if name in obj and obj[name] is not None:
                return obj[name]

    return default


# ==============================================================================
# STRING CLEANER
# ==============================================================================

def _clean_string(
    value: Any,
    default: str = "",
) -> str:
    """
    Converts a value into a clean display string.
    """

    if value is None:
        return default

    # Handle dictionaries separately because str(dict) is not useful
    # for frontend display.
    if isinstance(value, dict):

        # Common experience-level fields.
        for key in (
            "name",
            "level",
            "value",
            "title",
            "label",
        ):

            nested = value.get(key)

            if nested:
                return str(nested).strip()

        return default

    text = str(value).strip()

    return text if text else default


# ==============================================================================
# LOCATION FORMATTER
# ==============================================================================

def _format_location(job: Any) -> str:
    """
    Builds the most specific location available from the API.

    Example:
        Makati City, Metro Manila, Philippines
    """

    # First use an already-formatted location if the JobListing model has one.
    formatted = _get_attr(
        job,
        "location",
        "job_location",
        "formatted_location",
        "location_name",
        default=None,
    )

    # Extract individual geographic fields.
    city = _clean_string(
        _get_attr(
            job,
            "city",
            "job_city",
            "location_city",
        )
    )

    state = _clean_string(
        _get_attr(
            job,
            "state",
            "job_state",
            "location_state",
            "province",
            "region",
        )
    )

    country = _clean_string(
        _get_attr(
            job,
            "country",
            "job_country",
            "location_country",
        )
    )

    # Prefer the explicit API components when available.
    components = []

    if city:
        components.append(city)

    if state and state.lower() not in {
        city.lower(),
    }:
        components.append(state)

    if country and country.lower() not in {
        city.lower(),
        state.lower(),
    }:
        components.append(country)

    if components:
        return ", ".join(components)

    # Fall back to the model's existing formatted location.
    if formatted:
        return _clean_string(
            formatted,
            default="Location not disclosed",
        )

    # Do NOT invent "Philippines".
    return "Location not disclosed"


# ==============================================================================
# JOB TYPE
# ==============================================================================

def _get_job_type(job: Any) -> str:
    """
    Retrieves the employment/job type supplied by the API.
    """

    value = _get_attr(
        job,
        "job_type",
        "job_employment_type",
        "employment_type",
        "employmentType",
        "jobType",
        "type",
        default=None,
    )

    return _clean_string(
        value,
        default="Job type not disclosed",
    )


# ==============================================================================
# EXPERIENCE LEVEL
# ==============================================================================

def _get_experience_level(job: Any) -> str:
    """
    Retrieves the experience/seniority level supplied by the API.
    """

    value = _get_attr(
        job,
        "experience_level",
        "job_experience_level",
        "job_required_experience",
        "job_experience_in_place",
        "experienceLevel",
        "experience",
        "seniority",
        default=None,
    )

    return _clean_string(
        value,
        default="Experience level not disclosed",
    )


# ==============================================================================
# TEAM SIZE
# ==============================================================================

def _get_team_size(job: Any) -> str:
    """
    Retrieves company/team size when the API/model provides it.

    We intentionally DO NOT invent a company size.
    """

    value = _get_attr(
        job,
        "team_size",
        "company_size",
        "employer_company_size",
        "employer_size",
        "teamSize",
        "companySize",
        default=None,
    )

    # Some APIs/models may expose employee count directly.
    if value is None:

        value = _get_attr(
            job,
            "employee_count",
            "company_employee_count",
            "employer_employee_count",
            "employees",
            default=None,
        )

    if value is None:
        return "Team size not disclosed"

    # Handle dictionaries such as:
    # {"min": 51, "max": 200}
    if isinstance(value, dict):

        minimum = (
            value.get("min")
            or value.get("minimum")
            or value.get("from")
        )

        maximum = (
            value.get("max")
            or value.get("maximum")
            or value.get("to")
        )

        if minimum and maximum:
            return f"{minimum}–{maximum} employees"

        if minimum:
            return f"{minimum}+ employees"

    return _clean_string(
        value,
        default="Team size not disclosed",
    )


# ==============================================================================
# SALARY FORMATTER
# ==============================================================================

def _format_salary(job: dict) -> str:
    """
    Formats the salary while preserving the available currency.
    """

    lo = job.get("salary_min")
    hi = job.get("salary_max")

    currency = (
        job.get("salary_currency")
        or job.get("currency")
        or ""
    )

    currency = str(currency).strip().upper()

    # Map common currency codes to display symbols.
    currency_symbols = {
        "PHP": "₱",
        "USD": "$",
        "CAD": "C$",
        "AUD": "A$",
        "SGD": "S$",
        "GBP": "£",
        "EUR": "€",
    }

    symbol = currency_symbols.get(
        currency,
        currency + " " if currency else "",
    )

    try:

        if lo is not None and hi is not None:
            return (
                f"{symbol}{int(lo):,} – "
                f"{symbol}{int(hi):,}"
            )

        if lo is not None:
            return f"From {symbol}{int(lo):,}"

        if hi is not None:
            return f"Up to {symbol}{int(hi):,}"

    except (TypeError, ValueError):

        # If the API gave us a non-numeric salary, preserve it safely.
        return _clean_string(
            job.get("salary"),
            default="Not disclosed",
        )

    return "Not disclosed"


# ==============================================================================
# SHAPE TOP JOBS
# ==============================================================================

def _shape_top_jobs(top_jobs: list) -> list[dict]:
    """
    Converts ScoredJob objects into frontend-friendly dictionaries while
    preserving API metadata.
    """

    shaped = []

    for scored_job in top_jobs:

        job = getattr(scored_job, "job", None)

        if job is None:
            logger.warning(
                "Skipping scored job without a job object."
            )
            continue

        # Extract all location components.
        city = _clean_string(
            _get_attr(
                job,
                "city",
                "job_city",
                "location_city",
            )
        )

        state = _clean_string(
            _get_attr(
                job,
                "state",
                "job_state",
                "location_state",
                "province",
                "region",
            )
        )

        country = _clean_string(
            _get_attr(
                job,
                "country",
                "job_country",
                "location_country",
            )
        )

        shaped.append(
            {
                # --------------------------------------------------------------
                # Basic job information
                # --------------------------------------------------------------
                "title": _clean_string(
                    _get_attr(
                        job,
                        "title",
                        "job_title",
                    ),
                    default="Untitled job",
                ),

                "company": _clean_string(
                    _get_attr(
                        job,
                        "company",
                        "employer_name",
                        "company_name",
                    ),
                    default="Company not disclosed",
                ),

                # --------------------------------------------------------------
                # Full location information
                # --------------------------------------------------------------
                "location": _format_location(job),

                "city": city,

                "state": state,

                "country": country,

                # --------------------------------------------------------------
                # API employment information
                # --------------------------------------------------------------
                "jobType": _get_job_type(job),

                "experienceLevel": _get_experience_level(job),

                "teamSize": _get_team_size(job),

                # --------------------------------------------------------------
                # Job link
                # --------------------------------------------------------------
                "url": _clean_string(
                    _get_attr(
                        job,
                        "url",
                        "job_apply_link",
                        "apply_link",
                    ),
                    default="",
                ),

                # --------------------------------------------------------------
                # Match information
                # --------------------------------------------------------------
                "total_score": getattr(
                    scored_job,
                    "total_score",
                    0,
                ),

                "matched_skills": list(
                    getattr(
                        scored_job,
                        "matched_skills",
                        [],
                    )
                    or []
                ),

                # --------------------------------------------------------------
                # Description
                # --------------------------------------------------------------
                "description": _clean_string(
                    _get_attr(
                        job,
                        "description",
                        "job_description",
                    ),
                    default="",
                )[:500],

                # --------------------------------------------------------------
                # Salary
                # --------------------------------------------------------------
                "salary_min": _get_attr(
                    job,
                    "salary_min",
                    "job_min_salary",
                    "min_salary",
                ),

                "salary_max": _get_attr(
                    job,
                    "salary_max",
                    "job_max_salary",
                    "max_salary",
                ),

                "salary_currency": _clean_string(
                    _get_attr(
                        job,
                        "salary_currency",
                        "job_salary_currency",
                        "currency",
                    )
                ),

                # --------------------------------------------------------------
                # Original API job ID
                # --------------------------------------------------------------
                "job_id": _clean_string(
                    _get_attr(
                        job,
                        "job_id",
                        "id",
                    )
                ),
            }
        )

    return shaped


# ==============================================================================
# SHAPE COMPANY RESULTS
# ==============================================================================

def _shape_companies(
    top_companies: list,
    top_jobs_shaped: list[dict],
    raw_jobs: list | None = None,
) -> list[dict]:
    """
    Builds company cards from actual matched jobs.

    No hardcoded job type, experience level, location, or team size is used.
    """

    raw_jobs = raw_jobs or []

    shaped = []

    # --------------------------------------------------------------------------
    # Helper for normalized company comparison.
    # --------------------------------------------------------------------------

    def normalize_company(value: Any) -> str:

        return _clean_string(
            value
        ).strip().lower()

    # --------------------------------------------------------------------------
    # Process ranked companies.
    # --------------------------------------------------------------------------

    for company_match in top_companies:

        company_name = _clean_string(
            _get_attr(
                company_match,
                "company",
                "company_name",
                default="Company not disclosed",
            ),
            default="Company not disclosed",
        )

        company_key = normalize_company(company_name)

        # ----------------------------------------------------------------------
        # Find all matching shaped jobs for this company.
        # ----------------------------------------------------------------------

        company_jobs = [
            job
            for job in top_jobs_shaped
            if normalize_company(
                job.get("company")
            ) == company_key
        ]

        # ----------------------------------------------------------------------
        # If the company isn't represented in top_jobs, search raw API jobs.
        # ----------------------------------------------------------------------

        raw_company_jobs = []

        if not company_jobs:

            for raw_job in raw_jobs:

                raw_company = _clean_string(
                    _get_attr(
                        raw_job,
                        "company",
                        "employer_name",
                        "company_name",
                    )
                )

                if normalize_company(raw_company) == company_key:
                    raw_company_jobs.append(raw_job)

        # ----------------------------------------------------------------------
        # Use the first available job as the company's metadata source.
        # ----------------------------------------------------------------------

        source_job = None

        if company_jobs:
            source_job = company_jobs[0]

        elif raw_company_jobs:
            raw = raw_company_jobs[0]

            source_job = {
                "location": _format_location(raw),
                "city": _clean_string(
                    _get_attr(
                        raw,
                        "city",
                        "job_city",
                        "location_city",
                    )
                ),
                "state": _clean_string(
                    _get_attr(
                        raw,
                        "state",
                        "job_state",
                        "location_state",
                        "province",
                        "region",
                    )
                ),
                "country": _clean_string(
                    _get_attr(
                        raw,
                        "country",
                        "job_country",
                        "location_country",
                    )
                ),
                "jobType": _get_job_type(raw),
                "experienceLevel": _get_experience_level(raw),
                "teamSize": _get_team_size(raw),
                "salary_min": _get_attr(
                    raw,
                    "salary_min",
                    "job_min_salary",
                    "min_salary",
                ),
                "salary_max": _get_attr(
                    raw,
                    "salary_max",
                    "job_max_salary",
                    "max_salary",
                ),
                "salary_currency": _clean_string(
                    _get_attr(
                        raw,
                        "salary_currency",
                        "job_salary_currency",
                        "currency",
                    )
                ),
                "url": _clean_string(
                    _get_attr(
                        raw,
                        "url",
                        "job_apply_link",
                        "apply_link",
                    )
                ),
                "description": _clean_string(
                    _get_attr(
                        raw,
                        "description",
                        "job_description",
                    )
                ),
            }

        # ----------------------------------------------------------------------
        # Build metadata from the matched job.
        # ----------------------------------------------------------------------

        if source_job is None:

            location = "Location not disclosed"
            job_type = "Job type not disclosed"
            experience_level = "Experience level not disclosed"
            team_size = "Team size not disclosed"
            salary = "Not disclosed"
            top_job_url = ""

        else:

            location = _clean_string(
                source_job.get(
                    "location",
                    "Location not disclosed",
                ),
                default="Location not disclosed",
            )

            job_type = _clean_string(
                source_job.get(
                    "jobType",
                    "Job type not disclosed",
                ),
                default="Job type not disclosed",
            )

            experience_level = _clean_string(
                source_job.get(
                    "experienceLevel",
                    "Experience level not disclosed",
                ),
                default="Experience level not disclosed",
            )

            team_size = _clean_string(
                source_job.get(
                    "teamSize",
                    "Team size not disclosed",
                ),
                default="Team size not disclosed",
            )

            salary = _format_salary(
                source_job
            )

            top_job_url = _clean_string(
                source_job.get(
                    "url",
                    ""
                )
            )

        # ----------------------------------------------------------------------
        # Requirements.
        #
        # For now, preserve your existing frontend contract. We use actual
        # matching job titles instead of inventing requirements.
        #
        # You can later replace this with extracted requirements from the job
        # descriptions or job_requirements.py.
        # ----------------------------------------------------------------------

        requirements = [
            job["title"]
            for job in company_jobs[:4]
            if job.get("title")
        ]

        if not requirements:
            requirements = [
                "See job posting for details"
            ]

        # ----------------------------------------------------------------------
        # Match percentage.
        # ----------------------------------------------------------------------

        top_score = _get_attr(
            company_match,
            "top_score",
            "score",
            "match_score",
            default=0,
        )

        try:
            match_pct = round(float(top_score))
        except (TypeError, ValueError):
            match_pct = 0

        # Keep the score between 0 and 100.
        match_pct = max(
            0,
            min(
                match_pct,
                100,
            ),
        )

        # ----------------------------------------------------------------------
        # Company statistics.
        # ----------------------------------------------------------------------

        job_count = _get_attr(
            company_match,
            "job_count",
            "count",
            default=len(company_jobs),
        )

        avg_score = _get_attr(
            company_match,
            "avg_score",
            "average_score",
            default=match_pct,
        )

        # ----------------------------------------------------------------------
        # Reason text.
        # ----------------------------------------------------------------------

        reason = (
            f"{job_count} matching role"
            f"{'s' if job_count != 1 else ''} found "
            f"· Avg score {avg_score}/100"
        )

        # Highlight companies explicitly selected by the user.
        if bool(
            _get_attr(
                company_match,
                "targeted",
                default=False,
            )
        ):
            reason = (
                f"🎯 One of your target companies · {reason}"
            )

        # ----------------------------------------------------------------------
        # Append final company object.
        # ----------------------------------------------------------------------

        shaped.append(
            {
                "company": company_name,
                "match": match_pct,
                "reason": reason,
                "location": location,
                "jobType": job_type,
                "experienceLevel": experience_level,
                "salary": salary,
                "teamSize": team_size,
                "requirements": requirements,
                "top_job_url": top_job_url,
            }
        )

    return shaped


# ==============================================================================
# PERSIST RESUME
# ==============================================================================

def _persist_resume(
    parsed,
    filename: str,
    user_id: str | None,
    file_size_kb: float,
    target_job: str,
    target_companies: list[str],
) -> str | None:

    row = {
        "user_id": user_id,
        "filename": filename,
        "file_type": parsed.file_type,
        "file_size_kb": file_size_kb,
        "raw_text": parsed.raw_text,
        "contact_block": parsed.contact_block,
        "summary_block": parsed.summary_block,
        "experience_block": parsed.experience_block,
        "education_block": parsed.education_block,
        "skills_block": parsed.skills_block,
        "projects_block": parsed.projects_block,
        "certifications_block": parsed.certifications_block,
        "other_block": parsed.other_block,
        "word_count": parsed.word_count,
        "char_count": parsed.char_count,
        "section_count": parsed.section_count,
        "target_job": target_job,
        "target_companies": target_companies,
    }

    try:

        response = (
            supabase_admin
            .table("resumes")
            .insert(row)
            .execute()
        )

        if not response.data:

            logger.error(
                "Insert into resumes returned no rows "
                "(user_id=%s)",
                user_id,
            )

            return None

        inserted_row = response.data[0]

        if not isinstance(inserted_row, dict):

            logger.error(
                "Insert into resumes returned an invalid row "
                "(user_id=%s): %r",
                user_id,
                inserted_row,
            )

            return None

        raw_resume_id = inserted_row.get("id")

        if raw_resume_id is None:

            logger.error(
                "Insert into resumes returned a row without an id "
                "(user_id=%s)",
                user_id,
            )

            return None

        resume_id = str(raw_resume_id)

        logger.info(
            "analyze_controller | resume persisted | "
            "id=%s user_id=%s",
            resume_id,
            user_id,
        )

        return resume_id

    except Exception:

        logger.exception(
            "Failed to persist resume row "
            "(user_id=%s) — continuing without it",
            user_id,
        )

        return None


# ==============================================================================
# PERSIST ANALYSIS RESULT
# ==============================================================================

def _persist_analysis_result(
    resume_id: str | None,
    user_id: str | None,
    enrichment: dict,
    extracted_skills: list[str],
    companies_shaped: list[dict],
) -> str | None:

    if resume_id is None:

        logger.warning(
            "Skipping analysis_results insert "
            "(user_id=%s) — no resume_id",
            user_id,
        )

        return None

    section_values = {
        s["name"]: s["value"]
        for s in enrichment.get("sections", [])
    }

    row = {
        "resume_id": resume_id,
        "user_id": user_id,
        "ats_score": enrichment["ats_score"],
        "keyword_score": section_values.get("Keywords"),
        "formatting_score": section_values.get("Format"),
        "experience_score": None,
        "skills_score": section_values.get("Skills"),
        "grammar_score": None,
        "extracted_skills": extracted_skills,
        "skill_gaps": enrichment["skill_gaps"],
        "strengths": enrichment["strengths"],
        "improvements": enrichment["improvements"],
        "grammar_issues": enrichment["grammar_issues"],
        "company_matches": companies_shaped,
        "detected_role": None,
    }

    try:

        response = (
            supabase_admin
            .table("analysis_results")
            .insert(row)
            .execute()
        )

        if not response.data:

            logger.error(
                "Insert into analysis_results returned no rows "
                "(resume_id=%s)",
                resume_id,
            )

            return None

        inserted_row = response.data[0]

        if not isinstance(inserted_row, dict):

            logger.error(
                "Insert into analysis_results returned invalid row "
                "(resume_id=%s): %r",
                resume_id,
                inserted_row,
            )

            return None

        raw_analysis_id = inserted_row.get("id")

        if raw_analysis_id is None:

            logger.error(
                "Insert into analysis_results returned a row "
                "without an id (resume_id=%s)",
                resume_id,
            )

            return None

        analysis_id = str(raw_analysis_id)

        logger.info(
            "analyze_controller | analysis_result persisted | "
            "id=%s resume_id=%s",
            analysis_id,
            resume_id,
        )

        return analysis_id

    except Exception:

        logger.exception(
            "Failed to persist analysis_results row "
            "(resume_id=%s) — continuing without it",
            resume_id,
        )

        return None


# ==============================================================================
# JOB-POSTING TEXT SELECTION (for skill-gap comparison)
# ==============================================================================

def _tokenize_for_exclusion(text: str) -> set[str]:
    """
    Splits job title / company name text into lowercase tokens suitable
    for excluding from skill-gap extraction (see
    extract_skill_terms_from_posting()'s exclude_terms param).

    This is deliberately a plain, dumb tokenizer (no stemming, no stop
    words) — its only job is to make sure literal words from the job's
    own title/company (e.g. "Network", "Engineer", "Solutions") can't be
    reported back as one of that same job's required skills.
    """
    return {t for t in re.findall(r"[a-zA-Z][a-zA-Z0-9]*", text.lower()) if len(t) > 1}


def _select_job_posting_text(
    result,
) -> tuple[str | None, str | None, set[str]]:
    """
    Decides what text (if any) resume_enricher.enrich_resume_local() should
    treat as "the job posting" for the PRIMARY skill-gap comparison path.

    Priority order (per product decision):
      1. result.top_jobs[0] — the single best-matching REAL job listing
         JSearch returned, using its FULL, untruncated description (via
         the underlying ScoredJob.job.description — NOT the 500-char
         truncated copy in top_jobs_shaped, which exists only for
         display and would cut off skill mentions past that length).
      2. Otherwise (JSearch returned nothing — e.g. rate-limited, or no
         jobs matched at all): (None, None) — enrich_resume_local() then
         falls back internally to the pre-existing hardcoded taxonomy
         approach (job_requirements.py / SKILL_TAXONOMY — the "backup
         result").

    Note: the user's pasted job_description field is NOT used here — it
    still steers job matching/scoring itself (see JobMatcher.match() /
    JobScorer's target_description blending), but is deliberately not a
    skill-gap comparison source on its own. Only a real JSearch listing
    or the hardcoded taxonomy fallback are.

    Returns (job_posting_text, job_posting_source, exclude_terms):
      - source is a short, human-readable label echoed back to the
        frontend via the response's skill_gap_source field, so it's
        transparent which mode produced the skill_gaps the user is
        looking at.
      - exclude_terms is the tokenized job title + company name, so
        resume_enricher can strip the job's own metadata (e.g.
        "Solutions" from "SIGINT Solutions, LLC") out of the skill-gap
        candidate pool before it's ever scored. See
        extract_skill_terms_from_posting()'s exclude_terms param.
    """
    if result.top_jobs:
        top_scored_job = result.top_jobs[0]
        job = getattr(top_scored_job, "job", None)
        description = _get_attr(job, "description", "job_description", default="")
        if description and description.strip():
            title = _clean_string(_get_attr(job, "title", "job_title"), default="a matched role")
            company = _clean_string(_get_attr(job, "company", "employer_name"), default="a matched company")
            exclude_terms = _tokenize_for_exclusion(f"{title} {company}")
            return (
                description.strip(),
                f"your top-matching job posting ({title} at {company})",
                exclude_terms,
            )

    return None, None, set()


# ==============================================================================
# HANDLE ANALYZE
# ==============================================================================

async def handle_analyze(
    file: UploadFile,
    target_job: str,
    target_companies: str,
    job_description: str = "",
    user_id: str | None = None,
) -> dict:

    # ==========================================================================
    # STEP 1: VALIDATE FILE
    # ==========================================================================

    if file.content_type not in ALLOWED_RESUME_MIME_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported.",
        )

    # ==========================================================================
    # STEP 2: PARSE TARGET COMPANIES
    # ==========================================================================

    try:

        target_companies_list = (
            json.loads(target_companies)
            if target_companies
            else []
        )

        if not isinstance(
            target_companies_list,
            list,
        ):
            target_companies_list = []

    except (
        json.JSONDecodeError,
        TypeError,
    ):

        logger.warning(
            "Could not parse target_companies JSON: %r",
            target_companies,
        )

        target_companies_list = []

    # ==========================================================================
    # STEP 3: READ FILE
    # ==========================================================================

    try:

        file_bytes = await file.read()

    except Exception:

        logger.exception(
            "Failed to read uploaded file"
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Could not read the uploaded file. "
                "Please try again."
            ),
        )

    # ==========================================================================
    # STEP 4: PARSE RESUME
    # ==========================================================================

    try:

        parsed = parse_resume(
            file_bytes,
            filename=file.filename or "",
        )

    except ValueError as e:

        raise HTTPException(
            status_code=422,
            detail=str(e),
        )

    except Exception:

        logger.exception(
            "Unexpected error while parsing resume file"
        )

        raise HTTPException(
            status_code=422,
            detail=(
                "Could not read this file. "
                "It may be corrupted or unsupported."
            ),
        )

    # ==========================================================================
    # STEP 5: JOB MATCHING
    # ==========================================================================

    try:

        matcher = JobMatcher(
            api_key=os.getenv(
                "JSEARCH_API_KEY",
                "",
            )
        )

        result = matcher.match(
            parsed,
            target_job=target_job,
            target_job_description=job_description,
            target_companies=target_companies_list,
        )

    except ValueError as e:

        logger.error(
            "Job matching unavailable: %s",
            e,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Job matching is temporarily unavailable. "
                "Please try again later."
            ),
        )

    except Exception:

        logger.exception(
            "Unexpected error during job matching"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Something went wrong while analyzing "
                "your resume. Please try again."
            ),
        )

    # ==========================================================================
    # STEP 6: SHAPE JOB + COMPANY RESULTS
    # ==========================================================================

    try:

        top_jobs_shaped = _shape_top_jobs(
            result.top_jobs
        )

        companies_shaped = _shape_companies(
            result.top_companies,
            top_jobs_shaped,
            result.raw_jobs,
        )

        logger.info(
            "Analysis results | jobs=%d | top_jobs=%d | companies=%d",
            result.total_jobs,
            len(top_jobs_shaped),
            len(companies_shaped),
        )

    except Exception:

        logger.exception(
            "Unexpected error while shaping match results"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Something went wrong while formatting "
                "your results. Please try again."
            ),
        )

    # ==========================================================================
    # STEP 7: TARGET JOB GAP
    # ==========================================================================

    target_job_gap = calculate_target_job_gap(
        target_job,
        parsed,
    )

    # ==========================================================================
    # STEP 7.5: SELECT JOB-POSTING TEXT FOR SKILL-GAP COMPARISON
    #
    # Priority: best-matching real JSearch job listing (full, untruncated
    # description) -> None (enrich_resume_local then falls back to the
    # hardcoded job_requirements.py / SKILL_TAXONOMY taxonomy).
    # ==========================================================================

    job_posting_text, job_posting_source, job_posting_exclude_terms = _select_job_posting_text(result)

    if job_posting_text:
        logger.info("Skill-gap comparison source: %s", job_posting_source)
    else:
        logger.info(
            "Skill-gap comparison source: none available — falling back "
            "to hardcoded taxonomy"
        )

    # ==========================================================================
    # STEP 8: RESUME ENRICHMENT
    # ==========================================================================

    logger.info(
        "Running local resume enrichment..."
    )

    try:

        enrichment = enrich_resume_local(
            resume=parsed,
            keywords=result.keywords,
            top_jobs=top_jobs_shaped,
            target_job_gap=target_job_gap,
            job_posting_text=job_posting_text,
            job_posting_source=job_posting_source,
            job_posting_exclude_terms=job_posting_exclude_terms,
        )

    except Exception:

        logger.exception(
            "Unexpected error during resume enrichment"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Something went wrong while scoring "
                "your resume. Please try again."
            ),
        )

    logger.info(
        "Enrichment complete — ATS score: %d",
        enrichment["ats_score"],
    )

    # ==========================================================================
    # STEP 9: PERSIST RESUME
    # ==========================================================================

    file_size_kb = round(
        len(file_bytes) / 1024,
        2,
    )

    resume_id = _persist_resume(
        parsed,
        filename=file.filename or "upload",
        user_id=user_id,
        file_size_kb=file_size_kb,
        target_job=target_job,
        target_companies=target_companies_list,
    )

    # ==========================================================================
    # STEP 10: PERSIST ANALYSIS
    # ==========================================================================

    analysis_id = _persist_analysis_result(
        resume_id=resume_id,
        user_id=user_id,
        enrichment=enrichment,
        extracted_skills=result.keywords,
        companies_shaped=companies_shaped,
    )

    # ==========================================================================
    # STEP 11: FINAL RESPONSE
    # ==========================================================================

    return {
        "user_id": user_id,

        "resume_id": resume_id,

        "analysis_id": analysis_id,

        "keywords": result.keywords,

        "total_jobs": result.total_jobs,

        "top_jobs": top_jobs_shaped,

        "companies": companies_shaped,

        "ats_score": enrichment["ats_score"],

        "sections": enrichment["sections"],

        "strengths": enrichment["strengths"],

        "improvements": enrichment["improvements"],

        "skill_gaps": enrichment["skill_gaps"],

        "skill_gap_source": enrichment["skill_gap_source"],

        "grammar_issues": enrichment["grammar_issues"],
    }