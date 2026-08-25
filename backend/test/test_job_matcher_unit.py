# test/test_job_matcher.py
"""
Unit tests for the job matching phase.
No Adzuna API calls — everything is mocked/stubbed.

Run from backend/:
    pytest test/test_job_matcher.py -v
"""

import pytest
from unittest.mock import patch, MagicMock
from dataclasses import dataclass, field
from typing import List, Optional

# We import directly so tests work without the full app context
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.models.schemas import ParsedResume
from app.services.keyword_extractor import extract_keywords, _parse_skills_block, _tokenize
from backend.app.services.jsearch_client import AdzunaClient, JobListing
from app.services.job_scorer import JobScorer, ScoredJob, CompanyMatch


# ─────────────────────────────────────────────
# FIXTURES
# ─────────────────────────────────────────────

@pytest.fixture
def sample_resume() -> ParsedResume:
    return ParsedResume(
        raw_text=(
            "Benjamin Shah\nMechatronics Engineer\n"
            "Summary\nResults-oriented Mechanical and Mechatronics Engineer "
            "with expertise in automation, robotics, and CAD.\n"
            "Work Experience\nMechatronics Engineer, Borcelle Technologies (2023-Present)\n"
            "- Led development of automation systems achieving 15% efficiency gain.\n"
            "- Implemented preventive maintenance strategies.\n"
            "Education\nBachelor of Mechatronics Engineering with Honours\n"
            "University of Engineering Excellence (2016-2019)\n"
            "Skills\nMechatronics System Integration, Automotive Engineering, "
            "Project Management, Robotics and Automation, CAD for Mechatronics\n"
            "Certifications\nProfessional Engineer (PE) License, "
            "Project Management Professional (PMP)"
        ),
        contact_block="Benjamin Shah\nhello@reallygreatsite.com",
        summary_block=(
            "Results-oriented Mechanical and Mechatronics Engineer "
            "with expertise in automation, robotics, and CAD."
        ),
        experience_block=(
            "Mechatronics Engineer, Borcelle Technologies (2023-Present)\n"
            "- Led development of automation systems achieving 15% efficiency gain.\n"
            "- Implemented preventive maintenance strategies."
        ),
        education_block="Bachelor of Mechatronics Engineering with Honours",
        skills_block=(
            "Mechatronics System Integration, Automotive Engineering, "
            "Project Management, Robotics and Automation, CAD for Mechatronics"
        ),
        certifications_block="Professional Engineer (PE) License, Project Management Professional (PMP)",
        projects_block=None,
        other_block=None,
        word_count=80,
        char_count=600,
        section_count=6,
        file_type="pdf",
    )


@pytest.fixture
def sample_jobs() -> List[JobListing]:
    return [
        JobListing(
            job_id="1",
            title="Mechatronics Engineer",
            company="Siemens",
            location="Singapore",
            description=(
                "Looking for a Mechatronics Engineer with expertise in robotics, "
                "automation systems, CAD, and project management. "
                "Experience with Mechatronics System Integration preferred."
            ),
            salary_min=60000, salary_max=90000,
            url="https://example.com/job/1",
            category="Engineering",
            keywords_matched=["mechatronics", "robotics", "automation"],
        ),
        JobListing(
            job_id="2",
            title="Automation Engineer",
            company="ABB",
            location="Singapore",
            description=(
                "Seeking an Automation Engineer skilled in robotics and PLC programming. "
                "Background in mechanical engineering and CAD tools required."
            ),
            salary_min=55000, salary_max=80000,
            url="https://example.com/job/2",
            category="Engineering",
            keywords_matched=["automation", "robotics"],
        ),
        JobListing(
            job_id="3",
            title="Software Developer",
            company="TechCorp",
            location="Singapore",
            description=(
                "Full-stack developer needed. React, Node.js, Python experience. "
                "No engineering background required."
            ),
            salary_min=50000, salary_max=70000,
            url="https://example.com/job/3",
            category="IT",
            keywords_matched=["python"],
        ),
        JobListing(
            job_id="4",
            title="Mechatronics Project Engineer",
            company="Siemens",
            location="Singapore",
            description=(
                "Project engineer role focusing on mechatronics integration and "
                "automotive systems. Project Management Professional preferred."
            ),
            salary_min=65000, salary_max=95000,
            url="https://example.com/job/4",
            category="Engineering",
            keywords_matched=["mechatronics", "project management"],
        ),
    ]


# ─────────────────────────────────────────────
# KEYWORD EXTRACTOR TESTS
# ─────────────────────────────────────────────

class TestParseSkillsBlock:
    def test_comma_separated(self):
        skills = _parse_skills_block("Python, SQL, FastAPI")
        assert "Python" in skills
        assert "SQL" in skills
        assert "FastAPI" in skills

    def test_pipe_separated(self):
        skills = _parse_skills_block("React | Node.js | Docker")
        assert any("React" in s for s in skills)
        assert any("Docker" in s for s in skills)

    def test_newline_separated(self):
        skills = _parse_skills_block("Python\nSQL\nTableau")
        assert len(skills) == 3

    def test_strips_whitespace(self):
        skills = _parse_skills_block("  Python  ,  SQL  ")
        assert "Python" in skills
        assert "SQL" in skills

    def test_ignores_empty_entries(self):
        skills = _parse_skills_block("Python,,SQL,")
        assert "" not in skills
        assert len(skills) == 2


class TestTokenize:
    def test_lowercases(self):
        tokens = _tokenize("Python SQL FastAPI")
        assert "python" in tokens

    def test_filters_stop_words(self):
        tokens = _tokenize("the quick brown fox")
        assert "the" not in tokens

    def test_filters_short_tokens(self):
        tokens = _tokenize("a bb ccc dddd")
        assert "a" not in tokens
        assert "bb" not in tokens
        assert "ccc" in tokens

    def test_handles_empty(self):
        assert _tokenize("") == []


class TestExtractKeywords:
    def test_returns_list(self, sample_resume):
        kws = extract_keywords(sample_resume)
        assert isinstance(kws, list)

    def test_skills_block_keywords_present(self, sample_resume):
        kws = extract_keywords(sample_resume)
        kws_lower = [k.lower() for k in kws]
        # at least some skills block terms should appear
        assert any("mechatronics" in k for k in kws_lower)

    def test_respects_top_n(self, sample_resume):
        kws = extract_keywords(sample_resume, top_n=5)
        assert len(kws) <= 5

    def test_no_duplicates(self, sample_resume):
        kws = extract_keywords(sample_resume)
        lower = [k.lower() for k in kws]
        assert len(lower) == len(set(lower))

    def test_empty_skills_block_still_returns(self):
        resume = ParsedResume(
            raw_text="John Smith software developer Python JavaScript",
            skills_block=None,
            summary_block="Software developer with Python skills.",
            experience_block="Built web applications.",
            contact_block=None, education_block=None,
            projects_block=None, certifications_block=None,
            other_block=None,
            word_count=10, char_count=50, section_count=2, file_type="pdf",
        )
        kws = extract_keywords(resume)
        assert len(kws) > 0


# ─────────────────────────────────────────────
# JOB SCORER TESTS
# ─────────────────────────────────────────────

class TestJobScorer:
    def test_score_returns_scored_job(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        result = scorer.score_job(sample_jobs[0])
        assert isinstance(result, ScoredJob)

    def test_total_score_between_0_and_100(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        for job in sample_jobs:
            result = scorer.score_job(job)
            assert 0.0 <= result.total_score <= 100.0

    def test_relevant_job_scores_higher_than_irrelevant(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        mechatronics_job = scorer.score_job(sample_jobs[0])   # Mechatronics Engineer
        software_job     = scorer.score_job(sample_jobs[2])   # Software Developer
        assert mechatronics_job.total_score > software_job.total_score

    def test_score_all_returns_sorted_descending(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        results = scorer.score_all(sample_jobs)
        scores = [r.total_score for r in results]
        assert scores == sorted(scores, reverse=True)

    def test_matched_skills_are_subset_of_skills_block(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        result = scorer.score_job(sample_jobs[0])
        skills_lower = [s.lower() for s in result.matched_skills]
        # all matched skills should appear in the job text
        job_text = (sample_jobs[0].title + " " + sample_jobs[0].description).lower()
        for skill in skills_lower:
            assert skill in job_text

    def test_skills_score_capped_at_35(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        for job in sample_jobs:
            result = scorer.score_job(job)
            assert result.skills_score <= 35.0

    def test_keyword_score_capped_at_40(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        for job in sample_jobs:
            result = scorer.score_job(job)
            assert result.keyword_score <= 40.0


# ─────────────────────────────────────────────
# COMPANY RANKING TESTS
# ─────────────────────────────────────────────

class TestCompanyRanking:
    def test_returns_company_match_list(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        scored = scorer.score_all(sample_jobs)
        companies = scorer.rank_companies(scored)
        assert all(isinstance(c, CompanyMatch) for c in companies)

    def test_siemens_has_two_jobs(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        scored = scorer.score_all(sample_jobs)
        companies = scorer.rank_companies(scored)
        siemens = next((c for c in companies if c.company == "Siemens"), None)
        assert siemens is not None
        assert siemens.job_count == 2

    def test_engineering_company_ranks_above_tech_company(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        scored = scorer.score_all(sample_jobs)
        companies = scorer.rank_companies(scored)
        names = [c.company for c in companies]
        # Siemens or ABB should appear before TechCorp
        techcorp_idx = names.index("TechCorp") if "TechCorp" in names else 999
        eng_idx = min(
            names.index("Siemens") if "Siemens" in names else 999,
            names.index("ABB")     if "ABB"     in names else 999,
        )
        assert eng_idx < techcorp_idx

    def test_top_n_respected(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        scored = scorer.score_all(sample_jobs)
        companies = scorer.rank_companies(scored, top_n=2)
        assert len(companies) <= 2

    def test_top_job_is_best_in_company(self, sample_resume, sample_jobs):
        keywords = extract_keywords(sample_resume)
        scorer = JobScorer(resume=sample_resume, keywords=keywords)
        scored = scorer.score_all(sample_jobs)
        companies = scorer.rank_companies(scored)
        for company in companies:
            if company.job_count > 1:
                assert company.top_job.total_score == max(
                    j.total_score for j in company.all_jobs
                )


# ─────────────────────────────────────────────
# ADZUNA CLIENT TESTS (mocked)
# ─────────────────────────────────────────────

class TestAdzunaClient:
    def test_raises_without_credentials(self):
        with pytest.raises(ValueError, match="credentials"):
            AdzunaClient(app_id="", app_key="")

    def test_fetch_jobs_returns_job_listings(self):
        client = AdzunaClient(app_id="test_id", app_key="test_key")
        mock_response = {
            "results": [
                {
                    "id": "abc123",
                    "title": "Mechatronics Engineer",
                    "company": {"display_name": "Siemens"},
                    "location": {"display_name": "Singapore"},
                    "description": "Great role in automation.",
                    "salary_min": 60000,
                    "salary_max": 90000,
                    "redirect_url": "https://adzuna.com/job/abc123",
                    "category": {"label": "Engineering"},
                }
            ]
        }
        with patch.object(client, "_get", return_value=mock_response):
            jobs = client.fetch_jobs(["mechatronics"], results_per_keyword=10, max_keywords=1)

        assert len(jobs) == 1
        assert jobs[0].title == "Mechatronics Engineer"
        assert jobs[0].company == "Siemens"
        assert jobs[0].job_id == "abc123"

    def test_deduplicates_jobs_across_keywords(self):
        client = AdzunaClient(app_id="test_id", app_key="test_key")
        same_job = {
            "id": "dup001",
            "title": "Engineer",
            "company": {"display_name": "ACME"},
            "location": {"display_name": "SG"},
            "description": "An engineering role.",
            "salary_min": None, "salary_max": None,
            "redirect_url": "", "category": {"label": "Engineering"},
        }
        mock_response = {"results": [same_job]}

        with patch.object(client, "_get", return_value=mock_response):
            jobs = client.fetch_jobs(["mechatronics", "robotics"], max_keywords=2)

        # Should deduplicate to 1 job, with both keywords merged
        assert len(jobs) == 1
        assert "mechatronics" in jobs[0].keywords_matched
        assert "robotics" in jobs[0].keywords_matched

    def test_api_failure_on_one_keyword_continues(self):
        client = AdzunaClient(app_id="test_id", app_key="test_key")
        good_response = {"results": [
            {
                "id": "ok001", "title": "Good Job",
                "company": {"display_name": "GoodCo"},
                "location": {"display_name": "SG"},
                "description": "A good job.",
                "salary_min": None, "salary_max": None,
                "redirect_url": "", "category": {"label": "Tech"},
            }
        ]}

        call_count = [0]
        def side_effect(*args, **kwargs):
            call_count[0] += 1
            if call_count[0] == 1:
                raise ConnectionError("Simulated network error")
            return good_response

        with patch.object(client, "_get", side_effect=side_effect):
            jobs = client.fetch_jobs(["fail_keyword", "robotics"], max_keywords=2)

        # Should still return jobs from the second keyword
        assert len(jobs) == 1
        assert jobs[0].title == "Good Job"