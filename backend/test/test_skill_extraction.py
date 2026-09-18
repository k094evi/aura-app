"""Focused, offline tests for job-posting skill extraction."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.keyword_extractor import extract_skill_terms_from_posting


def test_extracts_skills_without_generic_posting_words():
    posting = (
        "We are looking for a product engineer. You will learn and grow "
        "with the team. Experience with Python, SQL, Docker, and AWS is "
        "required. Product growth mindset is a plus."
    )

    skills = extract_skill_terms_from_posting(posting, top_n=20)
    skills_lower = {skill.lower() for skill in skills}

    assert {"python", "sql", "docker", "aws"} <= skills_lower
    assert not {"and", "product", "growth", "learn", "grow", "mindset"} & skills_lower