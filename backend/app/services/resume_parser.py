# ==============================================================================
# FILE: app/services/resume_parser.py
# ==============================================================================
# PURPOSE OF THIS FILE (GUIDE):
#   This is where an uploaded resume file (PDF, DOC, or DOCX) first enters
#   the system. It's the very first step of the pipeline:
#
#       resume_parser.py (THIS FILE) --> keyword_extractor.py --> jsearch_client.py --> resume_enricher.py
#       (bytes in, structured            (structured resume       (real job            (score + feedback)
#        ParsedResume out)                 -> keywords)              listings)
#
#   Given the raw bytes of an uploaded file, `parse_resume()`:
#     1. Detects the actual file type (PDF vs DOCX/DOC), not just trusting
#        the filename extension, using the `python-magic` library with an
#        extension-based fallback.
#     2. Extracts plain text from the file (`pdfplumber` for PDFs,
#        `python-docx` for Word files).
#     3. Cleans that text (normalizes whitespace/line endings, strips
#        control characters, standardizes bullet/dash characters).
#     4. Splits the cleaned text into resume sections (contact, summary,
#        experience, education, skills, projects, certifications) by
#        detecting section header lines.
#     5. Validates that the result actually LOOKS like a resume (not an
#        invoice, essay, or blank page that merely happens to be a valid
#        PDF/DOCX) using three independent heuristics, and rejects the
#        file with a specific error message if it doesn't pass.
#     6. Returns a `ParsedResume` object — the shared data structure that
#        every later step in the pipeline (keyword extraction, job
#        fetching, enrichment/scoring) is built on top of.
#
# IMPORTANT NAMING/BEHAVIOR NOTES (kept from the original — tests rely on
# these exact names and error message substrings, so don't rename/reword
# them without updating the tests too):
#   - The import `from app.models.schemas import ParsedResume` — tests
#     expect this exact name.
#   - `parse_resume()` raises `ValueError("empty")` for zero-byte uploads,
#     `ValueError("Unsupported file type")` for non-PDF/DOCX files,
#     `ValueError("empty or unreadable")` for files with too little
#     extractable text, and a distinct, detailed "doesn't look like a
#     resume" ValueError when the content-validation heuristics fail —
#     each message is intentionally different so the API layer/frontend
#     can show the user a specific, actionable message.
# ==============================================================================

import io
import re
import logging
from typing import Dict, Optional, Tuple

import pdfplumber
from docx import Document as DocxDocument

# IMPORTANT: tests expect this name
from app.models.schemas import ParsedResume

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# SECTION HEADERS
# ─────────────────────────────────────────────

SECTION_HEADERS: list[Tuple[str, list[str]]] = [
    ("contact",  ["contact", "personal information", "personal details"]),
    ("summary",  ["summary", "objective", "profile", "about", "career objective",
                  "professional summary", "professional profile"]),
    ("experience", ["experience", "work experience", "employment", "work history",
                    "professional experience", "career history"]),
    ("education", ["education", "academic background", "qualifications",
                   "educational background", "academic history"]),
    ("skills",   ["skills", "technical skills", "core competencies",
                  "key skills", "competencies",
                  "languages", "tools", "technologies", "areas of expertise"]),
    ("projects", ["projects", "portfolio", "personal projects", "key projects"]),
    ("certifications", ["certifications", "certificates", "training",
                        "licenses", "awards", "achievements", "honors",
                        "professional development"]),
]

# ─────────────────────────────────────────────
# RESUME CONTENT VALIDATION
# Used to reject files that parse fine (valid PDF/DOCX, readable text)
# but clearly aren't a resume — e.g. an invoice, an essay, a blank
# template, a random report.
# ─────────────────────────────────────────────

_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_PHONE_RE = re.compile(r"(\+?\d[\d\-\.\s\(\)]{7,}\d)")

# Words/phrases that strongly correlate with resume content.
# Not a strict requirement individually — used as one of three signals.
RESUME_SIGNAL_WORDS = {
    "resume", "curriculum vitae", "cv", "objective", "summary",
    "professional experience", "work experience", "employment", "education",
    "university", "college", "degree", "bachelor", "master", "diploma",
    "skills", "certification", "certifications", "references", "internship",
    "responsibilities", "achievements", "projects", "portfolio", "gpa",
    "linkedin",
}

# Minimum number of distinct signal words that must appear for the
# "resume vocabulary" check to pass.
RESUME_VOCAB_MIN_HITS = 3

# Minimum number of the 3 signal checks (sections / contact info / vocabulary)
# that must pass for a document to be accepted as a resume.
RESUME_SIGNALS_REQUIRED = 2


def _count_signal_words(text: str) -> int:
    text_l = text.lower()
    return sum(1 for phrase in RESUME_SIGNAL_WORDS if phrase in text_l)


def _looks_like_resume(cleaned_text: str, sections: Dict[str, str]) -> Tuple[bool, list]:
    """
    Checks three independent signals that a document is a resume:
      1. Structural sections beyond the default "contact" catch-all
         (e.g. experience, education, skills were actually detected)
      2. Contact info present (email or phone number)
      3. Resume-specific vocabulary present

    Requires at least RESUME_SIGNALS_REQUIRED of the 3 to pass.
    Returns (is_resume, list_of_failure_reasons) — reasons are always
    returned so the caller can build a helpful error message even when
    validation passes (unused in that case).
    """
    reasons_failed = []

    recognized_sections = [k for k in sections if k != "contact"]
    has_structural_sections = len(recognized_sections) >= 2
    if not has_structural_sections:
        reasons_failed.append(
            "no recognizable resume sections (e.g. experience, education, skills)"
        )

    has_contact_info = bool(_EMAIL_RE.search(cleaned_text)) or bool(_PHONE_RE.search(cleaned_text))
    if not has_contact_info:
        reasons_failed.append("no email address or phone number detected")

    has_vocab = _count_signal_words(cleaned_text) >= RESUME_VOCAB_MIN_HITS
    if not has_vocab:
        reasons_failed.append("little resume-specific vocabulary detected")

    passed = sum([has_structural_sections, has_contact_info, has_vocab])
    return passed >= RESUME_SIGNALS_REQUIRED, reasons_failed


# ─────────────────────────────────────────────
# MIME DETECTION
# ─────────────────────────────────────────────

SUPPORTED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}

EXT_TO_MIME = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "doc": "application/msword",
}


def _detect_mime(file_bytes: bytes, filename: str) -> str:
    try:
        import magic
        mime = magic.from_buffer(file_bytes, mime=True)
    except Exception:
        mime = None

    if mime in SUPPORTED_MIME_TYPES:
        return mime

    ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
    return EXT_TO_MIME.get(ext, "unknown")


# ─────────────────────────────────────────────
# CLEANING (IMPORTANT: preserve newlines properly)
# ─────────────────────────────────────────────

def _clean(text: str) -> str:
    # normalize line endings FIRST before stripping control chars
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # strip control characters but PRESERVE \n (0x0a)
    text = re.sub(r"[\x00-\x09\x0b-\x1f\x7f]", "", text)

    text = text.replace("–", "-").replace("—", "-")
    text = text.replace("\u00a0", " ")

    text = re.sub(r"[•·▪◦]", "- ", text)

    # clean each line but KEEP newline structure
    lines = []
    for line in text.split("\n"):
        line = re.sub(r"[ \t]+", " ", line).strip()
        if line != "":
            lines.append(line)

    text = "\n".join(lines)

    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


# ─────────────────────────────────────────────
# SECTION DETECTION (must be importable by tests)
# ─────────────────────────────────────────────

def _is_section_header(line: str) -> Optional[str]:
    line = line.strip().lower()

    if len(line) > 60 or len(line.split()) > 6:
        return None

    for name, triggers in SECTION_HEADERS:
        for t in triggers:
            if t in line:
                return name

    return None


def _split_sections(text: str) -> Dict[str, str]:
    sections: Dict[str, list[str]] = {"contact": []}
    current = "contact"

    for line in text.split("\n"):
        header = _is_section_header(line)

        if header:
            current = header
            sections.setdefault(current, [])
        else:
            sections.setdefault(current, [])
            sections[current].append(line)

    result = {}
    for k, v in sections.items():
        content = "\n".join([x for x in v if x.strip()]).strip()
        if content:
            result[k] = content

    return result


# ─────────────────────────────────────────────
# PDF EXTRACTION
# ─────────────────────────────────────────────

def _extract_pdf(file_bytes: bytes) -> str:
    pages = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages.append(text)

    if not pages:
        raise ValueError("image-only PDF")

    return "\n".join(pages)


# ─────────────────────────────────────────────
# DOCX EXTRACTION
# ─────────────────────────────────────────────

def _extract_docx(file_bytes: bytes) -> str:
    doc = DocxDocument(io.BytesIO(file_bytes))

    lines = []

    for p in doc.paragraphs:
        if p.text.strip():
            lines.append(p.text.strip())

    for table in doc.tables:
        for row in table.rows:
            row_text = [c.text.strip() for c in row.cells if c.text.strip()]
            if row_text:
                lines.append(" | ".join(row_text))

    if not lines:
        raise ValueError("empty docx")

    return "\n".join(lines)


# ─────────────────────────────────────────────
# PUBLIC API (TEST-COMPATIBLE)
# ─────────────────────────────────────────────

def parse_resume(
    file_bytes: bytes,
    filename: str = "",
    file_type: Optional[str] = None
) -> ParsedResume:
    """
    PUBLIC ENTRY POINT for this file — the route/controller layer (e.g.
    app/routes/parsing.py -> app/controllers/parsing_controller.py) calls
    this with the raw uploaded file bytes and gets back a structured
    `ParsedResume`, or a `ValueError` explaining why the file was rejected.
    """

    if not file_bytes:
        # IMPORTANT: tests expect "empty" in message
        raise ValueError("empty")

    mime = file_type or _detect_mime(file_bytes, filename)

    if mime == "application/pdf":
        raw = _extract_pdf(file_bytes)
        ftype = "pdf"

    elif mime in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ]:
        raw = _extract_docx(file_bytes)
        ftype = "docx"

    else:
        raise ValueError("Unsupported file type")

    cleaned = _clean(raw)

    if len(cleaned) < 20:
        raise ValueError("empty or unreadable")

    sections = _split_sections(cleaned)

    is_resume, failure_reasons = _looks_like_resume(cleaned, sections)
    if not is_resume:
        # IMPORTANT: message intentionally distinct from other ValueErrors
        # above ("empty", "Unsupported file type", "empty or unreadable")
        # so the API layer / frontend can show a specific, actionable message.
        detail = "; ".join(failure_reasons)
        raise ValueError(
            f"This file doesn't look like a resume ({detail}). "
            "Please upload a resume or CV in PDF or DOCX format."
        )

    return ParsedResume(
        raw_text=cleaned,
        contact_block=sections.get("contact"),
        summary_block=sections.get("summary"),
        experience_block=sections.get("experience"),
        education_block=sections.get("education"),
        skills_block=sections.get("skills"),
        projects_block=sections.get("projects"),
        certifications_block=sections.get("certifications"),
        other_block=None,
        word_count=len(cleaned.split()),
        char_count=len(cleaned),
        section_count=len(sections),
        file_type=ftype,
    )