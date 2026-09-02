# app/services/certification_engine.py

from app.data.job_requirements import JOB_REQUIREMENTS
from app.data.certifications_registry import CERTIFICATIONS


class UnknownJobError(Exception):
    # Raised when the requested job is not supported by AURA.
    pass


def recommend_certifications(
    target_job: str,
    resume_certifications: list[str],
) -> dict:
    # Normalize the target job for case-insensitive lookup.
    job_key = target_job.strip().lower()

    # Get the certification requirements for the selected job.
    job = JOB_REQUIREMENTS.get(job_key)

    # Stop if the target job is not supported.
    if job is None:
        raise UnknownJobError(
            f"'{target_job}' isn't a supported job"
        )

    # Normalize resume certifications for case-insensitive comparison.
    resume_certs_set = {
        cert.strip().lower()
        for cert in resume_certifications
    }

    # Get certifications required for the selected job.
    required = job["required_certifications"]

    # Get certifications that are useful but optional for the job.
    optional = job["optional_certifications"]

    # Compare the user's certifications against the job requirements.
    return {
        # Return certifications the user already has with additional details.
        "matched_certifications": _enrich(
            [
                cert
                for cert in required + optional
                if cert in resume_certs_set
            ]
        ),

        # Return required certifications the user is missing.
        "missing_required_certifications": _enrich(
            [
                cert
                for cert in required
                if cert not in resume_certs_set
            ]
        ),

        # Return optional certifications the user does not have.
        "missing_optional_certifications": _enrich(
            [
                cert
                for cert in optional
                if cert not in resume_certs_set
            ]
        ),
    }


def _enrich(cert_names: list[str]) -> list[dict]:
    # Store certification details in the format expected by the frontend.
    enriched = []

    # Look up additional information for every certification.
    for name in cert_names:
        # Find the certification in AURA's certification registry.
        info = CERTIFICATIONS.get(name)

        # Build a complete certification object even if registry data is missing.
        enriched.append({
            # Store the short certification name.
            "name": name,

            # Use registry data or create a readable fallback name.
            "full_name": (
                info["full_name"]
                if info
                else name.upper()
                if len(name) <= 5
                else name.title()
            ),

            # Include the certification provider when available.
            "provider": info["provider"] if info else None,

            # Include the official certification URL when available.
            "url": info["url"] if info else None,
        })

    # Return the enriched certification list to the analysis service.
    return enriched