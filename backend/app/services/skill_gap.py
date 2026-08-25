# app/services/skill_gap.py
from app.data.job_requirements import JOB_REQUIREMENTS


class UnknownJobError(Exception):
    """Raised when the target job isn't one of AURA's supported roles."""
    pass


def calculate_skill_gap(target_job: str, resume_skills: list[str]) -> dict:
    job_key = target_job.strip().lower()
    job = JOB_REQUIREMENTS.get(job_key)

    if job is None:
        raise UnknownJobError(f"'{target_job}' isn't a supported job")

    resume_skills_set = {s.lower() for s in resume_skills}
    required = job["skills"]["required"]
    optional = job["skills"]["optional"]

    return {
        "matched_skills": [s for s in required + optional if s in resume_skills_set],
        "missing_required_skills": [s for s in required if s not in resume_skills_set],
        "missing_optional_skills": [s for s in optional if s not in resume_skills_set],
    }