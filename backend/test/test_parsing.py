"""
tests/test_parsing.py
──────────────────────
Unit tests for:
  - app/utils/text_cleaner.py
  - app/services/resume_parser.py  (_is_section_header, _split_sections, parse_resume)

Run with:  pytest tests/test_parsing.py -v
"""

import pytest
from unittest.mock import patch, MagicMock

from app.utils.text_cleaner import clean_text, to_plain_sentences
from app.services.resume_parser import (
    _is_section_header,
    _split_sections,
    parse_resume,
)
from app.schema.resume_schema import ParsedResumeSchema


# ─────────────────────────────────────────────────────────────────────────────
# text_cleaner.clean_text()
# ─────────────────────────────────────────────────────────────────────────────

class TestCleanText:
    def test_removes_control_characters(self):
        assert "\x00" not in clean_text("Hello\x00World")
        assert "\x07" not in clean_text("Hello\x07World")

    def test_collapses_inline_spaces(self):
        assert clean_text("too   many   spaces") == "too many spaces"

    def test_collapses_excess_blank_lines(self):
        result = clean_text("line1\n\n\n\n\nline2")
        assert "\n\n\n" not in result
        assert "line1" in result and "line2" in result

    def test_normalises_em_dash(self):
        assert "-" in clean_text("2020\u20142022")

    def test_normalises_en_dash(self):
        assert "-" in clean_text("2020\u20132022")

    def test_replaces_bullet_variants(self):
        result = clean_text("• Python\n· Java\n▪ Go")
        for bullet in ["•", "·", "▪"]:
            assert bullet not in result

    def test_replaces_nonbreaking_space(self):
        assert "\u00a0" not in clean_text("hello\u00a0world")

    def test_strips_leading_trailing_whitespace(self):
        assert clean_text("  hello  ") == "hello"

    def test_preserves_internal_newlines(self):
        assert "\n" in clean_text("line1\nline2")


# ─────────────────────────────────────────────────────────────────────────────
# resume_parser._is_section_header()
# ─────────────────────────────────────────────────────────────────────────────

class TestIsSectionHeader:
    def test_detects_experience(self):
        assert _is_section_header("Work Experience") == "experience"
        assert _is_section_header("PROFESSIONAL EXPERIENCE") == "experience"

    def test_detects_education(self):
        assert _is_section_header("Education") == "education"
        assert _is_section_header("EDUCATIONAL BACKGROUND") == "education"

    def test_detects_skills(self):
        assert _is_section_header("Technical Skills") == "skills"
        assert _is_section_header("CORE COMPETENCIES") == "skills"

    def test_detects_summary(self):
        assert _is_section_header("Professional Summary") == "summary"
        assert _is_section_header("Career Objective") == "summary"

    def test_detects_projects(self):
        assert _is_section_header("Projects") == "projects"
        assert _is_section_header("Personal Projects") == "projects"

    def test_detects_certifications(self):
        assert _is_section_header("Certifications") == "certifications"
        assert _is_section_header("CERTIFICATES") == "certifications"

    def test_ignores_long_lines(self):
        long = "Developed and maintained a full-stack application using React and Node.js"
        assert _is_section_header(long) is None

    def test_ignores_sentences_ending_with_period(self):
        assert _is_section_header("Managed a team of engineers.") is None

    def test_ignores_empty_and_whitespace(self):
        assert _is_section_header("") is None
        assert _is_section_header("   ") is None


# ─────────────────────────────────────────────────────────────────────────────
# resume_parser._split_sections()
# ─────────────────────────────────────────────────────────────────────────────

SAMPLE_RESUME = """John Dela Cruz
john@email.com | +63 917 123 4567 | linkedin.com/in/johndc

Professional Summary
Results-driven Software Engineer with 4 years of experience.

Work Experience
Software Engineer - Accenture Philippines (2021-2024)
- Built REST APIs using FastAPI and PostgreSQL
- Reduced page load time by 40%

Education
BS Information Technology - University of the Philippines (2017-2021)

Technical Skills
Python, JavaScript, React, FastAPI, Docker, PostgreSQL

Projects
Aura Resume Analyzer - capstone project using BERT and Next.js

Certifications
AWS Certified Developer - Associate (2023)
"""


class TestSplitSections:
    def test_finds_experience_section(self):
        sections = _split_sections(SAMPLE_RESUME)
        assert "experience" in sections

    def test_finds_education_section(self):
        sections = _split_sections(SAMPLE_RESUME)
        assert "education" in sections

    def test_finds_skills_section(self):
        sections = _split_sections(SAMPLE_RESUME)
        assert "skills" in sections

    def test_experience_contains_job_content(self):
        sections = _split_sections(SAMPLE_RESUME)
        exp = sections.get("experience", "")
        assert "Accenture" in exp or "REST APIs" in exp

    def test_skills_contains_python(self):
        sections = _split_sections(SAMPLE_RESUME)
        assert "Python" in sections.get("skills", "")

    def test_education_contains_university(self):
        sections = _split_sections(SAMPLE_RESUME)
        assert "University" in sections.get("education", "") or \
               "Information Technology" in sections.get("education", "")

    def test_header_lines_not_in_section_values(self):
        sections = _split_sections(SAMPLE_RESUME)
        for value in sections.values():
            assert "Work Experience\n" not in value

    def test_no_headers_defaults_to_contact(self):
        plain = "John Smith\nsome bio text\nmore text"
        sections = _split_sections(plain)
        assert "contact" in sections


# ─────────────────────────────────────────────────────────────────────────────
# resume_parser.parse_resume()  — integration level, mocked file IO
# ─────────────────────────────────────────────────────────────────────────────

MOCK_TEXT = """Jane Santos
jane@email.com | 09171234567

Summary
Senior data analyst with 5 years of experience.

Work Experience
Data Analyst - Globe Telecom (2019-2024)
- Analysed customer churn using Python and SQL

Education
BS Statistics - Ateneo de Manila University (2015-2019)

Technical Skills
Python, SQL, Tableau, Excel, R

Certifications
Google Data Analytics Professional Certificate (2022)
"""


class TestParseResume:
    def test_raises_on_empty_bytes(self):
        with pytest.raises(ValueError, match="empty"):
            parse_resume(b"", "resume.pdf", "pdf")

    def test_pdf_returns_parsed_schema(self):
        mock_page = MagicMock()
        mock_page.extract_text.return_value = MOCK_TEXT
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("pdfplumber.open", return_value=mock_pdf):
            result = parse_resume(b"fake-pdf", "resume.pdf", "pdf")

        assert isinstance(result, ParsedResumeSchema)
        assert result.file_type == "pdf"
        assert result.word_count > 0
        assert result.skills_block is not None
        assert result.experience_block is not None
        assert result.education_block is not None

    def test_docx_returns_parsed_schema(self):
        mock_para = lambda text: MagicMock(
            text=text,
            style=MagicMock(name="Normal"),
        )
        mock_doc = MagicMock()
        mock_doc.paragraphs = [mock_para(line) for line in MOCK_TEXT.splitlines()]
        mock_doc.tables = []
        mock_doc.element = MagicMock()

        with patch("app.services.resume_parser.DocxDocument", return_value=mock_doc):
            result = parse_resume(b"fake-docx", "resume.docx", "docx")

        assert isinstance(result, ParsedResumeSchema)
        assert result.file_type == "docx"
        assert "Python" in (result.skills_block or "")

    def test_all_schema_fields_present(self):
        mock_page = MagicMock()
        mock_page.extract_text.return_value = MOCK_TEXT
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("pdfplumber.open", return_value=mock_pdf):
            result = parse_resume(b"fake-pdf", "resume.pdf", "pdf")

        assert result.raw_text
        assert result.word_count > 0
        assert result.char_count > 0
        assert result.section_count > 0

    def test_image_pdf_raises_value_error(self):
        mock_page = MagicMock()
        mock_page.extract_text.return_value = None
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page, mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("pdfplumber.open", return_value=mock_pdf):
            with pytest.raises(ValueError, match="image-only"):
                parse_resume(b"fake-scanned-pdf", "scanned.pdf", "pdf")