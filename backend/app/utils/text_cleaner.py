"""
FILE LOCATION: app/utils/text_cleaner.py
──────────────────────────────────────────

PURPOSE
-------
This module holds standalone text-normalization helpers used AFTER raw
text has already been extracted from an uploaded resume (e.g. after a
PDF/DOCX has been converted to plain text elsewhere). It does not deal
with files at all — only with cleaning up the resulting string so it's
consistent and predictable for downstream processing.

HOW IT FITS INTO THE PROGRAM
-----------------------------
- `resume_parser.py` calls `clean_text()` right after extracting raw
  text, before doing any further parsing (e.g. pulling out name,
  skills, experience).
- The `ai_models/` preprocessing pipeline re-uses these same functions
  so that text fed into the AI models has gone through identical
  cleaning — keeping behavior consistent across the app instead of
  each part inventing its own cleaning rules.

FUNCTIONS IN THIS FILE
-----------------------
- clean_text(raw)          → the main normalization pipeline (see the
                              9 numbered steps in its own docstring).
- remove_urls(text)        → strips http(s) links, useful before
                              feeding text into NLP tokenizers.
- remove_emails(text)      → strips email addresses.
- remove_phone_numbers(text) → strips phone numbers.
- to_plain_sentences(text) → flattens multi-line bulleted resume text
                              into one space-separated block, useful
                              as input for sentence-embedding models.
"""

import re


def clean_text(raw: str) -> str:
    """
    Full normalisation pipeline for raw resume text.

    Steps (order matters):
      1. Strip zero-width and non-printable control characters
      2. Normalise Unicode dashes (en/em) → ASCII hyphen
      3. Normalise fancy quotes → straight quotes
      4. Normalise Unicode bullet variants → '- '
      5. Replace non-breaking spaces with regular spaces
      6. Collapse runs of spaces/tabs within a line
      7. Strip whitespace from each line
      8. Collapse 3+ consecutive blank lines → 2
      9. Strip overall leading/trailing whitespace
    """
    # 1. Control chars (keep \t \n \r) — removes invisible junk that can
    #    sneak in from PDF/DOCX extraction without touching real newlines/tabs.
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", raw)

    # 2. Dashes — en dash (–) and em dash (—) become a plain hyphen (-)
    #    so downstream text matching doesn't have to handle both forms.
    text = re.sub(r"[–—]", "-", text)

    # 3. Fancy quotes — curly single/double quotes become straight ones.
    text = re.sub(r"[\u2018\u2019]", "'", text)
    text = re.sub(r"[\u201c\u201d]", '"', text)

    # 4. Bullets — various bullet glyphs used across resume templates
    #    all become a plain "- " so lists look uniform.
    text = re.sub(r"[•·▪◦▶➤➢]", "- ", text)

    # 5. Non-breaking space — common artifact from PDF/Word extraction,
    #    replaced with a normal space so whitespace logic below works.
    text = text.replace("\u00a0", " ")

    # 6. Inline whitespace collapse — multiple spaces/tabs within a
    #    single line become one space.
    text = re.sub(r"[ \t]{2,}", " ", text)

    # 7. Per-line strip — removes leading/trailing whitespace on every
    #    individual line (but keeps the line breaks themselves).
    lines = [line.strip() for line in text.splitlines()]
    text = "\n".join(lines)

    # 8. Blank line collapse — 3 or more consecutive blank lines become
    #    just 2, so large empty gaps in the resume don't carry through.
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 9. Final trim of the whole string.
    return text.strip()


def remove_urls(text: str) -> str:
    """Remove http(s) URLs — useful before NLP tokenisation."""
    return re.sub(r"https?://\S+", "", text)


def remove_emails(text: str) -> str:
    """Remove email addresses from the text."""
    return re.sub(r"[\w.+-]+@[\w-]+\.\w{2,}", "", text)


def remove_phone_numbers(text: str) -> str:
    """Remove phone-number-like sequences (digits with separators) from the text."""
    return re.sub(r"\+?\d[\d\s\-().]{7,}\d", "", text)


def to_plain_sentences(text: str) -> str:
    """
    Collapses multi-line resume bullets into a single block of
    space-separated sentences — useful as input for sentence embedders.
    """
    # For each non-blank line: strip whitespace, strip a leading "- "
    # bullet marker, strip again, then join every line with a single
    # space so the whole resume becomes one continuous block of text.
    lines = [l.strip().lstrip("- ").strip() for l in text.splitlines() if l.strip()]
    return " ".join(lines)