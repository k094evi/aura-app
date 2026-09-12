# ==============================================================================
# FILE: app/services/certification_engine.py
# ==============================================================================
#
# PURPOSE:
#   Converts missing resume skills into certification recommendations by
#   looking up matching certifications in the Supabase "certifications" table.
#
# ==============================================================================

from typing import Any, Iterable

from app.extensions.supabase_client import supabase


def recommend_certifications(
    missing_skills: Iterable[str],
) -> list[dict[str, Any]]:
    """
    Find certification recommendations for missing skills.

    Args:
        missing_skills:
            An iterable of skill-name strings.

    Returns:
        A list containing one recommendation object per missing skill.
    """

    results: list[dict[str, Any]] = []

    # Process every missing skill individually.
    for skill in missing_skills:

        # Ignore invalid/empty skill values.
        if not isinstance(skill, str) or not skill.strip():
            continue

        # Normalize the skill before querying Supabase.
        normalized_skill = skill.strip()

        try:
            # Query the certifications table for this skill.
            response = (
                supabase
                .table("certifications")
                .select("certification_name")
                .eq("skill_name", normalized_skill)
                .execute()
            )

        except Exception as exc:
            # Do not allow one failed certification query to crash
            # the entire resume-analysis pipeline.
            print(
                f"Certification lookup failed for "
                f"'{normalized_skill}': {exc}"
            )

            results.append({
                "skill": normalized_skill,
                "missing": True,
                "recommendation": f"Improve {normalized_skill}",
                "certifications": [],
            })

            continue

        # Supabase normally returns a list of rows in response.data.
        # Defensively handle None or an unexpected response shape.
        data = response.data

        if not isinstance(data, list):
            data = []

        certifications: list[str] = []

        # Process each returned database row.
        for row in data:

            # Supabase rows should be dictionaries.
            if not isinstance(row, dict):
                continue

            certification_name = row.get("certification_name")

            # Only keep actual string certification names.
            if isinstance(certification_name, str):
                certification_name = certification_name.strip()

                if certification_name:
                    certifications.append(certification_name)

        # Remove duplicate certification names while preserving order.
        certifications = list(dict.fromkeys(certifications))

        # Add the recommendation for this skill.
        results.append({
            "skill": normalized_skill,
            "missing": True,
            "recommendation": f"Improve {normalized_skill}",
            "certifications": certifications,
        })

    return results