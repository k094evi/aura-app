# app/services/certificate_extractor.py

from app.utils.phrase_matching import build_matcher, find_matches
from app.data.job_requirements import get_all_known_certifications


# Build one matcher containing every certification supported by AURA.
_matcher = build_matcher(
    get_all_known_certifications(),
    label="CERTIFICATIONS",
)


def extract_certifications(text: str) -> list[str]:
    # Find known certifications inside the extracted resume text.
    matches = find_matches(text, _matcher)

    # Return certifications alphabetically for consistent results.
    return sorted(matches)