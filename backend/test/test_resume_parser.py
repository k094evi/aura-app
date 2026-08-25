"""
tests/test_resume_parser.py
────────────────────────────
Unit tests for the resume_parser service.

Run with:  pytest tests/ -v
"""

import io
import pytest
from unittest.mock import patch, MagicMock

from app.services.resume_parser import (
    _clean,
    _is_section_header,
    _split_sections,
    parse_resume,
)
from app.models.schemas import ParsedResume


# ─────────────────────────────────────────────────────────────────────────────
# _clean()
# ─────────────────────────────────────────────────────────────────────────────

class TestClean:
    def test_removes_nonprintable(self):
        raw = "Hello\x00World\x07"
        assert "\x00" not in _clean(raw)
        assert "\x07" not in _clean(raw)
        assert "HelloWorld" in _clean(raw)

    def test_collapses_spaces(self):
        assert _clean("too   many   spaces") == "too many spaces"

    def test_collapses_blank_lines(self):
        raw = "line1\n\n\n\n\nline2"
        cleaned = _clean(raw)
        assert "\n\n\n" not in cleaned
        assert "line1" in cleaned
        assert "line2" in cleaned

    def test_normalises_unicode_dashes(self):
        assert "-" in _clean("2020\u20132022")   # en-dash
        assert "-" in _clean("2020\u20142022")   # em-dash

    def test_normalises_bullets(self):
        result = _clean("• Python\n· Java\n▪ Go")
        assert "•" not in result
        assert "·" not in result
        assert "▪" not in result

    def test_strips_surrounding_whitespace(self):
        assert _clean("  hello  ") == "hello"

    def test_preserves_newlines(self):
        result = _clean("line1\nline2")
        assert "\n" in result


# ─────────────────────────────────────────────────────────────────────────────
# _is_section_header()
# ─────────────────────────────────────────────────────────────────────────────

class TestIsSectionHeader:
    def test_detects_experience(self):
        assert _is_section_header("Work Experience") == "experience"
        assert _is_section_header("PROFESSIONAL EXPERIENCE") == "experience"
        assert _is_section_header("experience") == "experience"

    def test_detects_education(self):
        assert _is_section_header("Education") == "education"
        assert _is_section_header("EDUCATIONAL BACKGROUND") == "education"

    def test_detects_skills(self):
        assert _is_section_header("Technical Skills") == "skills"
        assert _is_section_header("CORE COMPETENCIES") == "skills"
        assert _is_section_header("Skills") == "skills"

    def test_detects_summary(self):
        assert _is_section_header("Professional Summary") == "summary"
        assert _is_section_header("Objective") == "summary"
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

    def test_ignores_sentence_ending_with_period(self):
        assert _is_section_header("Managed a team of engineers.") is None

    def test_ignores_empty_line(self):
        assert _is_section_header("") is None
        assert _is_section_header("   ") is None


# ─────────────────────────────────────────────────────────────────────────────
# _split_sections()
# ─────────────────────────────────────────────────────────────────────────────

class TestSplitSections:
    SAMPLE_RESUME = """John Dela Cruz
john@email.com | +63 917 123 4567 | linkedin.com/in/johndc

Professional Summary
Results-driven Software Engineer with 4 years of experience
building scalable web applications.

Work Experience
Software Engineer — Accenture Philippines (2021–2024)
- Built REST APIs using FastAPI and PostgreSQL
- Reduced page load time by 40% through caching

Education
BS Information Technology — University of the Philippines (2017–2021)

Technical Skills
Python, JavaScript, React, FastAPI, Docker, PostgreSQL

Projects
Aura Resume Analyzer — capstone project using BERT and Next.js

Certifications
AWS Certified Developer – Associate (2023)
"""

    def test_finds_expected_sections(self):
        sections = _split_sections(self.SAMPLE_RESUME)
        assert "experience" in sections
        assert "education" in sections
        assert "skills" in sections

    def test_experience_contains_job_text(self):
        sections = _split_sections(self.SAMPLE_RESUME)
        exp = sections.get("experience", "")
        assert "Accenture" in exp or "REST APIs" in exp

    def test_skills_contains_python(self):
        sections = _split_sections(self.SAMPLE_RESUME)
        skills = sections.get("skills", "")
        assert "Python" in skills

    def test_education_contains_university(self):
        sections = _split_sections(self.SAMPLE_RESUME)
        edu = sections.get("education", "")
        assert "University" in edu or "Information Technology" in edu

    def test_no_section_header_text_in_values(self):
        """Section header lines themselves should not appear in section text."""
        sections = _split_sections(self.SAMPLE_RESUME)
        for value in sections.values():
            # "Work Experience" as a bare line should not be in the value
            assert "Work Experience\n" not in value

    def test_single_block_no_headers(self):
        plain = "John Smith\nsome text about john\nmore text"
        sections = _split_sections(plain)
        # Everything goes to 'contact' when no headers found
        assert "contact" in sections


# ─────────────────────────────────────────────────────────────────────────────
# parse_resume() — integration-level, with mocked file IO
# ─────────────────────────────────────────────────────────────────────────────

MOCK_RESUME_TEXT = """Jane Santos
jane@email.com | 09171234567

Summary
Senior data analyst with 5 years of experience.

Work Experience
Data Analyst — Globe Telecom (2019–2024)
- Analysed customer churn using Python and SQL
- Built dashboards in Tableau

Education
BS Statistics — Ateneo de Manila University (2015–2019)

Technical Skills
Python, SQL, Tableau, Excel, R

Certifications
Google Data Analytics Professional Certificate (2022)
"""


class TestParseResume:
    def test_raises_on_empty_bytes(self):
        with pytest.raises(ValueError, match="empty"):
            parse_resume(b"", "resume.pdf")

    def test_raises_on_unsupported_type(self):
        with pytest.raises(ValueError, match="Unsupported"):
            with patch("app.services.resume_parser._detect_mime", return_value="image/png"):
                parse_resume(b"fake", "resume.png")

    def test_pdf_parse_returns_parsed_resume(self):
        """Mock pdfplumber to return our sample text."""
        mock_page = MagicMock()
        mock_page.extract_text.return_value = MOCK_RESUME_TEXT
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("app.services.resume_parser._detect_mime", return_value="application/pdf"), \
             patch("pdfplumber.open", return_value=mock_pdf):
            result = parse_resume(b"fake-pdf-bytes", "resume.pdf")

        assert isinstance(result, ParsedResume)
        assert result.file_type == "pdf"
        assert result.word_count > 0
        assert result.section_count >= 3
        assert result.experience_block is not None
        assert result.skills_block is not None
        assert result.education_block is not None

    def test_docx_parse_returns_parsed_resume(self):
        """Mock python-docx to return our sample paragraphs."""
        mock_para = lambda text: MagicMock(
            text=text,
            style=MagicMock(name="Normal"),
        )
        paragraphs = [mock_para(line) for line in MOCK_RESUME_TEXT.splitlines()]
        mock_doc = MagicMock()
        mock_doc.paragraphs = paragraphs
        mock_doc.tables = []
        mock_doc.element = MagicMock()

        docx_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        with patch("app.services.resume_parser._detect_mime", return_value=docx_mime), \
             patch("app.services.resume_parser.DocxDocument", return_value=mock_doc):
            result = parse_resume(b"fake-docx-bytes", "resume.docx")

        assert isinstance(result, ParsedResume)
        assert result.file_type == "docx"
        assert "Python" in (result.skills_block or "")

    def test_result_has_all_expected_fields(self):
        mock_page = MagicMock()
        mock_page.extract_text.return_value = MOCK_RESUME_TEXT
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("app.services.resume_parser._detect_mime", return_value="application/pdf"), \
             patch("pdfplumber.open", return_value=mock_pdf):
            result = parse_resume(b"fake-pdf-bytes", "resume.pdf")

        # All schema fields should be present
        assert result.raw_text
        assert result.word_count > 0
        assert result.char_count > 0
        assert result.section_count > 0
        assert result.file_type in ("pdf", "docx")

    def test_image_pdf_raises_value_error(self):
        """pdfplumber returns None for every page → should raise ValueError."""
        mock_page = MagicMock()
        mock_page.extract_text.return_value = None
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page, mock_page]
        mock_pdf.__enter__ = lambda s: mock_pdf
        mock_pdf.__exit__ = MagicMock(return_value=False)

        with patch("app.services.resume_parser._detect_mime", return_value="application/pdf"), \
             patch("pdfplumber.open", return_value=mock_pdf):
            with pytest.raises(ValueError, match="image-only"):
                parse_resume(b"fake-scanned-pdf", "scanned.pdf")