# ==============================================================================
# FILE: app/services/certification_engine.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This file turns a resume's "missing skills" (identified elsewhere, e.g.
#   by resume_enricher.py's `_detect_skill_gaps`) into concrete
#   certification recommendations, by looking each missing skill up in a
#   Supabase table called "certifications".
#
#   Pipeline position: this runs AFTER the resume has already been scored
#   and gaps identified — it's an enrichment/recommendation step, not part
#   of the core parse -> keywords -> jobs -> score flow.
#
#       resume_enricher.py                certification_engine.py (THIS FILE)
#       (figures out which skills   -->   (for each missing skill, looks up
#        are missing)                      real certifications that teach it,
#                                           from the Supabase "certifications"
#                                           table)
#
# DATA SOURCE:
#   Reads from the Supabase table "certifications", which is expected to
#   have at least two columns:
#     - skill_name           : the skill this certification teaches
#     - certification_name   : the human-readable name of the certification
#   For each requested skill, this queries that table for all rows whose
#   skill_name matches, and collects their certification_name values.
#
# NOTE ON PERFORMANCE:
#   This issues one Supabase query PER missing skill (a loop of `.execute()`
#   calls), rather than a single batched query. That's fine for the small
#   number of skill gaps (~6 max, per resume_enricher.py) this is typically
#   called with, but would be worth batching (e.g. a single `.in_()` query)
#   if this function is ever called with a much longer skill list.
# ==============================================================================

from app.extensions.supabase_client import supabase


def recommend_certifications(
    missing_skills
):
    """
    PUBLIC ENTRY POINT for this file.

    Args:
        missing_skills: an iterable of skill-name strings (e.g. the
            "missing" skills surfaced by resume_enricher._detect_skill_gaps)
            to find matching certifications for.

    Returns:
        A list of dicts, one per input skill, shaped like:
            {
                "skill": <skill name>,
                "missing": True,
                "recommendation": "Improve <skill>",
                "certifications": [<certification names from Supabase>],
            }
        "missing" is always True here, since this function only ever
        receives skills that were already identified as gaps.
    """

    results = []

    # Look up matching certifications one skill at a time.
    for skill in missing_skills:

        # Query Supabase's "certifications" table for every row where
        # skill_name matches this skill, pulling back just the
        # certification_name column.
        response = (
            supabase
            .table(
                "certifications"
            )
            .select(
                "certification_name"
            )
            .eq(
                "skill_name",
                skill
            )
            .execute()
        )

        # Flatten the query result rows (each a dict) into a plain list
        # of certification name strings.
        certs = [
            row[
                "certification_name"
            ]
            for row in response.data
        ]

        # Build this skill's recommendation entry and add it to the output.
        results.append({

            "skill": skill,

            "missing": True,

            "recommendation":
                f"Improve {skill}",

            "certifications":
                certs
        })

    return results