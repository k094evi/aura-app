# app/services/skill_extractor.py

from app.utils.phrase_matching import build_matcher, find_matches
from app.data.job_requirements import get_all_known_skills


# Build one matcher containing every skill supported by AURA.
_matcher = build_matcher(
    get_all_known_skills(),
    label="SKILLS",
)


def extract_skills(text: str) -> list[str]:
    # Find known AURA skills inside the extracted resume text.
    matches = find_matches(text, _matcher)

    # Return skills alphabetically for consistent results.
    return sorted(matches)