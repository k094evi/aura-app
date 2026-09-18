"""
FILE: app/services/target_job_matcher.py

PURPOSE:
    Handles target-job skill and certification gap analysis.

This service uses JOB_REQUIREMENTS from:
    app/data/job_requirements.py

JOB_REQUIREMENTS is the single source of truth for:
    - Required skills
    - Optional skills
    - Required certifications
    - Optional certifications

This file also supports JOB_TITLE_ALIASES so that different
versions of a job title can still resolve to the correct
supported target job.
"""

from typing import Optional

from app.data.job_requirements import (
    JOB_REQUIREMENTS,
    JOB_TITLE_ALIASES,
)

from app.models.schemas import ParsedResume


# ============================================================
# BUILD NORMALIZED JOB LOOKUP
# ============================================================
# JOB_REQUIREMENTS uses display-friendly titles such as:
#
#     "Backend Developer"
#     "QA Engineer"
#     "UI/UX Designer"
#
# We create a lowercase lookup so the backend can safely accept:
#
#     "Backend Developer"
#     "backend developer"
#     " BACKEND DEVELOPER "
#
# without changing the original JOB_REQUIREMENTS dictionary.
# ============================================================

_NORMALIZED_JOB_LOOKUP: dict[str, str] = {
    job_name.strip().lower(): job_name
    for job_name in JOB_REQUIREMENTS
}


# ============================================================
# BUILD JOB ALIAS LOOKUP
# ============================================================
# Example:
#
#     "front-end developer"
#     "frontend engineer"
#     "web developer"
#
# can all resolve to:
#
#     "Frontend Developer"
#
# The aliases in job_requirements.py are lowercase, so they are
# normalized here as well.
# ============================================================

_ALIAS_LOOKUP: dict[str, str] = {}

for canonical_job, aliases in JOB_TITLE_ALIASES.items():

    # Find the actual JOB_REQUIREMENTS key.
    canonical_key = _NORMALIZED_JOB_LOOKUP.get(
        canonical_job.strip().lower()
    )

    # Skip the alias group if the canonical job does not exist.
    if canonical_key is None:
        continue

    for alias in aliases:
        _ALIAS_LOOKUP[alias.strip().lower()] = canonical_key


# ============================================================
# RESOLVE TARGET JOB
# ============================================================

def _resolve_target_job(target_job: str) -> Optional[str]:
    """
    Converts a user/frontend target-job value into the exact
    JOB_REQUIREMENTS key.

    Examples:

        "Backend Developer"
            -> "Backend Developer"

        "backend developer"
            -> "Backend Developer"

        "front-end developer"
            -> "Frontend Developer"

        "frontend engineer"
            -> "Frontend Developer"

        "unknown job"
            -> None
    """

    if not target_job:
        return None

    normalized = target_job.strip().lower()

    # --------------------------------------------------------
    # First try the actual supported job titles.
    # --------------------------------------------------------
    canonical_job = _NORMALIZED_JOB_LOOKUP.get(normalized)

    if canonical_job:
        return canonical_job

    # --------------------------------------------------------
    # Then try the aliases.
    # --------------------------------------------------------
    return _ALIAS_LOOKUP.get(normalized)


# ============================================================
# GET SUPPORTED TARGET JOBS
# ============================================================

def get_supported_target_jobs() -> list[str]:
    """
    Returns the official job titles from JOB_REQUIREMENTS.

    This should be used by the frontend dropdown instead of
    maintaining a second hardcoded list.
    """

    return sorted(JOB_REQUIREMENTS.keys())


# ============================================================
# NORMALIZE RESUME TEXT
# ============================================================

def _build_resume_haystack(
    skills_block: Optional[str],
    raw_text: Optional[str],
) -> str:
    """
    Combines resume skill data and raw resume text into one
    lowercase searchable string.
    """

    return " ".join(
        value
        for value in [skills_block, raw_text]
        if value
    ).lower()


# ============================================================
# CALCULATE TARGET JOB GAP
# ============================================================

def calculate_target_job_gap(
    target_job: str,
    resume: ParsedResume,
) -> Optional[dict]:
    """
    Calculates the skill and certification gaps for a target job.

    Returns None when:
        - target_job is blank
        - target_job is not supported

    Example return:

    {
        "target_job": "Backend Developer",
        "matched_skills": [
            "python",
            "sql",
            "git"
        ],
        "missing_required_skills": [
            "rest api"
        ],
        "missing_optional_skills": [
            "docker",
            "kubernetes"
        ],
        "missing_certifications": [
            "aws certified developer"
        ]
    }
    """

    # --------------------------------------------------------
    # Resolve the submitted job title.
    # --------------------------------------------------------

    canonical_job = _resolve_target_job(target_job)

    if canonical_job is None:
        return None

    # --------------------------------------------------------
    # Get the job requirements.
    # --------------------------------------------------------
    #
    # IMPORTANT:
    # Your JOB_REQUIREMENTS structure is:
    #
    # {
    #     "required_skills": [...],
    #     "optional_skills": [...],
    #     "required_certifications": [...],
    #     "optional_certifications": [...]
    # }
    #
    # Therefore we access these directly.
    # --------------------------------------------------------

    job = JOB_REQUIREMENTS[canonical_job]

    # --------------------------------------------------------
    # Build searchable resume text.
    # --------------------------------------------------------

    haystack = _build_resume_haystack(
        getattr(resume, "skills_block", None),
        getattr(resume, "raw_text", None),
    )

    # --------------------------------------------------------
    # Get requirements.
    # --------------------------------------------------------

    required_skills = job["required_skills"]
    optional_skills = job["optional_skills"]

    required_certifications = job["required_certifications"]
    optional_certifications = job["optional_certifications"]

    # --------------------------------------------------------
    # Find matched skills.
    # --------------------------------------------------------

    matched_skills = [
        skill
        for skill in required_skills + optional_skills
        if skill.lower() in haystack
    ]

    # --------------------------------------------------------
    # Find missing required skills.
    # --------------------------------------------------------

    missing_required_skills = [
        skill
        for skill in required_skills
        if skill.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Find missing optional skills.
    # --------------------------------------------------------

    missing_optional_skills = [
        skill
        for skill in optional_skills
        if skill.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Find missing required certifications.
    # --------------------------------------------------------

    missing_certifications = [
        certification
        for certification in required_certifications
        if certification.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Find matched certifications.
    # --------------------------------------------------------

    matched_certifications = [
        certification
        for certification in (
            required_certifications + optional_certifications
        )
        if certification.lower() in haystack
    ]

    # --------------------------------------------------------
    # Find missing optional certifications.
    # --------------------------------------------------------

    missing_optional_certifications = [
        certification
        for certification in optional_certifications
        if certification.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Return complete target-job analysis.
    # --------------------------------------------------------

    return {
        "target_job": canonical_job,

        "matched_skills": matched_skills,

        "missing_required_skills": missing_required_skills,

        "missing_optional_skills": missing_optional_skills,

        "matched_certifications": matched_certifications,

        "missing_certifications": missing_certifications,

        "missing_optional_certifications": (
            missing_optional_certifications
        ),
    }


# ============================================================
# CALCULATE TARGET JOB GAP FROM DATABASE ROW
# ============================================================

def calculate_target_job_gap_from_row(
    target_job: str,
    row: dict,
) -> Optional[dict]:
    """
    Same target-job analysis as calculate_target_job_gap(),
    but works directly with a Supabase resumes table row.

    This is useful for:

        POST /api/resumes/{resume_id}/analyze

    where the resume has already been parsed and stored.
    """

    # --------------------------------------------------------
    # Resolve the submitted target job.
    # --------------------------------------------------------

    canonical_job = _resolve_target_job(target_job)

    if canonical_job is None:
        return None

    # --------------------------------------------------------
    # Get the job requirements.
    # --------------------------------------------------------

    job = JOB_REQUIREMENTS[canonical_job]

    # --------------------------------------------------------
    # Safely retrieve resume fields from Supabase.
    # --------------------------------------------------------

    skills_block = row.get("skills_block")

    raw_text = row.get("raw_text")

    # --------------------------------------------------------
    # Build searchable resume text.
    # --------------------------------------------------------

    haystack = _build_resume_haystack(
        skills_block,
        raw_text,
    )

    # --------------------------------------------------------
    # Get requirements.
    # --------------------------------------------------------

    required_skills = job["required_skills"]
    optional_skills = job["optional_skills"]

    required_certifications = job["required_certifications"]
    optional_certifications = job["optional_certifications"]

    # --------------------------------------------------------
    # Match skills.
    # --------------------------------------------------------

    matched_skills = [
        skill
        for skill in required_skills + optional_skills
        if skill.lower() in haystack
    ]

    # --------------------------------------------------------
    # Missing required skills.
    # --------------------------------------------------------

    missing_required_skills = [
        skill
        for skill in required_skills
        if skill.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Missing optional skills.
    # --------------------------------------------------------

    missing_optional_skills = [
        skill
        for skill in optional_skills
        if skill.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Matched certifications.
    # --------------------------------------------------------

    matched_certifications = [
        certification
        for certification in (
            required_certifications + optional_certifications
        )
        if certification.lower() in haystack
    ]

    # --------------------------------------------------------
    # Missing required certifications.
    # --------------------------------------------------------

    missing_certifications = [
        certification
        for certification in required_certifications
        if certification.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Missing optional certifications.
    # --------------------------------------------------------

    missing_optional_certifications = [
        certification
        for certification in optional_certifications
        if certification.lower() not in haystack
    ]

    # --------------------------------------------------------
    # Return complete analysis.
    # --------------------------------------------------------

    return {
        "target_job": canonical_job,

        "matched_skills": matched_skills,

        "missing_required_skills": missing_required_skills,

        "missing_optional_skills": missing_optional_skills,

        "matched_certifications": matched_certifications,

        "missing_certifications": missing_certifications,

        "missing_optional_certifications": (
            missing_optional_certifications
        ),
    }