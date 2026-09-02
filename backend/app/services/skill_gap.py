# app/services/skill_gap.py

from app.data.job_requirements import JOB_REQUIREMENTS


class UnknownJobError(Exception):
    """Raised when the target job isn't one of AURA's supported roles."""
    pass


def calculate_skill_gap(
    target_job: str,
    resume_skills: list[str],
) -> dict:
    # Normalize the job title so capitalization and extra spaces don't matter.
    job_key = target_job.strip().lower()

    # Find the requirements for the selected AURA job.
    job = JOB_REQUIREMENTS.get(job_key)

    # Stop the analysis if the job is not supported by AURA.
    if job is None:
        raise UnknownJobError(
            f"'{target_job}' isn't a supported job"
        )

    # Normalize resume skills for case-insensitive comparison.
    resume_skills_set = {
        skill.strip().lower()
        for skill in resume_skills
    }

    # Get the required skills defined for this job.
    required = job["required_skills"]

    # Get the optional skills defined for this job.
    optional = job["optional_skills"]

    # Compare the resume skills against the job requirements.
    return {
        # Required skills that already exist in the resume.
        "matched_required_skills": [
            skill
            for skill in required
            if skill in resume_skills_set
        ],

        # Optional skills that already exist in the resume.
        "matched_optional_skills": [
            skill
            for skill in optional
            if skill in resume_skills_set
        ],

        # Required skills that are missing from the resume.
        "missing_required_skills": [
            skill
            for skill in required
            if skill not in resume_skills_set
        ],

        # Optional skills that are missing from the resume.
        "missing_optional_skills": [
            skill
            for skill in optional
            if skill not in resume_skills_set
        ],
    }