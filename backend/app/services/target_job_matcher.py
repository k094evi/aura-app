# FILE LOCATION: app/services/target_job_matcher.py
"""
Migrated from backend_2's app/services/skill_gap.py + skill_extractor.py,
combined and adapted to FastAPI/your schema:

  - skill_extractor.py's spaCy PhraseMatcher is dropped — not needed, since
    skill matching here is just substring lookup against skills_block /
    raw_text, same lightweight approach as job_scorer.py's _skill_tokens.
    Avoids adding spaCy as a dependency.
  - skill_gap.py's UnknownJobError is dropped in favor of returning None —
    callers (analyze_controller.py, resumes.py) treat "not a supported
    role" as "just omit this section", not a hard error.
"""

from typing import Optional
from app.data.job_requirements import JOB_REQUIREMENTS
from app.models.schemas import ParsedResume


def get_supported_target_jobs() -> list[str]:
    """Feed this to the frontend for a target_job dropdown/autocomplete."""
    return sorted(JOB_REQUIREMENTS.keys())


def calculate_target_job_gap(target_job: str, resume: ParsedResume) -> Optional[dict]:
    """
    None if target_job is blank or unsupported. Otherwise:
        {
            "target_job": "software engineer",
            "matched_skills": [...],
            "missing_required_skills": [...],
            "missing_optional_skills": [...],
            "missing_certifications": [...],
        }
    """
    if not target_job:
        return None

    job_key = target_job.strip().lower()
    job = JOB_REQUIREMENTS.get(job_key)
    if job is None:
        return None

    haystack = " ".join(filter(None, [resume.skills_block, resume.raw_text])).lower()

    required = job["skills"]["required"]
    optional = job["skills"]["optional"]
    required_certs = job["certifications"]["required"]

    return {
        "target_job": job_key,
        "matched_skills": [s for s in required + optional if s in haystack],
        "missing_required_skills": [s for s in required if s not in haystack],
        "missing_optional_skills": [s for s in optional if s not in haystack],
        "missing_certifications": [c for c in required_certs if c not in haystack],
    }


def calculate_target_job_gap_from_row(target_job: str, row: dict) -> Optional[dict]:
    """
    Same as calculate_target_job_gap, but works off a raw Supabase `resumes`
    table row (dict) instead of a ParsedResume object — used by the
    analyze-by-id route in app/api/routes/resumes.py, where we're
    re-reading a resume that was already parsed and stored, not
    re-parsing an upload.
    """
    if not target_job:
        return None

    job_key = target_job.strip().lower()
    job = JOB_REQUIREMENTS.get(job_key)
    if job is None:
        return None

    haystack = " ".join(filter(None, [row.get("skills_block"), row.get("raw_text")])).lower()

    required = job["skills"]["required"]
    optional = job["skills"]["optional"]
    required_certs = job["certifications"]["required"]

    return {
        "target_job": job_key,
        "matched_skills": [s for s in required + optional if s in haystack],
        "missing_required_skills": [s for s in required if s not in haystack],
        "missing_optional_skills": [s for s in optional if s not in haystack],
        "missing_certifications": [c for c in required_certs if c not in haystack],
    }