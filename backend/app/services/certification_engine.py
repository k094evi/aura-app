# ==============================================================================
# FILE: app/services/certification_engine.py
# ==============================================================================
#
# PURPOSE:
#   Converts missing resume skills into certification recommendations by
#   looking up matching certifications in the Supabase "certifications" table.
#   Matching is case-insensitive, so "python" finds "Python".
#
# ==============================================================================

import logging
from typing import Any, Iterable

from app.extensions.supabase_client import supabase

logger = logging.getLogger(__name__)


def recommend_certifications(
    missing_skills: Iterable[str],
) -> list[dict[str, Any]]:
    """
    Find certification recommendations for missing skills.

    Returns one recommendation object per (deduplicated) missing skill:
        {"skill", "missing", "recommendation", "certifications": [str, ...]}
    """

    # Normalize + dedupe skills case-insensitively, preserving order.
    skills: list[str] = []
    seen: set[str] = set()
    for skill in missing_skills:
        if not isinstance(skill, str):
            continue
        s = skill.strip()
        if not s or s.lower() in seen:
            continue
        seen.add(s.lower())
        skills.append(s)

    if not skills:
        return []

    # One query for all skills, then group rows by lowercased skill_name.
    by_skill: dict[str, list[str]] = {}
    query_failed = False

    try:
        response = (
            supabase
            .table("certifications")
            .select("skill_name, certification_name")
            .execute()
        )
        rows = response.data if isinstance(response.data, list) else []

        for row in rows:
            if not isinstance(row, dict):
                continue
            skill_name = row.get("skill_name")
            cert_name = row.get("certification_name")
            if not isinstance(skill_name, str) or not isinstance(cert_name, str):
                continue
            cert_name = cert_name.strip()
            if not cert_name:
                continue
            by_skill.setdefault(skill_name.strip().lower(), []).append(cert_name)

    except Exception as exc:
        # Never let a certification lookup crash the analysis pipeline.
        logger.warning("Certification lookup failed: %s", exc)
        query_failed = True

    results: list[dict[str, Any]] = []
    for skill in skills:
        certs = [] if query_failed else list(dict.fromkeys(by_skill.get(skill.lower(), [])))
        results.append({
            "skill": skill,
            "missing": True,
            "recommendation": f"Improve {skill}",
            "certifications": certs,
        })

    logger.info(
        "Certification lookup: %d skills, %d with matches",
        len(results),
        sum(1 for r in results if r["certifications"]),
    )
    return results