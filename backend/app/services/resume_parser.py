# app/services/resume_parser.py

import io

from pypdf import PdfReader
from docx import Document

from app.extensions.supabase_client import supabase


class ResumeParsingError(Exception):
    """Raised when a resume file can't be downloaded or its text extracted."""
    pass


def extract_text(storage_path: str) -> str:
    # Download the resume file from Supabase Storage.
    file_bytes = _download_resume_file(storage_path)

    # Get the file extension to determine which parser to use.
    extension = storage_path.rsplit(".", 1)[-1].lower()

    # Extract text using the appropriate parser for the file type.
    if extension == "pdf":
        text = _extract_pdf_text(file_bytes)

    elif extension == "docx":
        text = _extract_docx_text(file_bytes)

    else:
        # Reject file formats that AURA does not support.
        raise ResumeParsingError(
            f"Unsupported file type: .{extension}"
        )

    # Make sure the parser actually found readable text.
    if not text or not text.strip():
        raise ResumeParsingError(
            "No readable text found in this resume"
        )

    # Return the extracted resume text to the analysis pipeline.
    return text


def _download_resume_file(storage_path: str) -> bytes:
    # Download the resume bytes from the private Supabase Storage bucket.
    try:
        return supabase.storage.from_("resumes").download(storage_path)

    # Convert Supabase errors into an AURA-specific parsing error.
    except Exception as e:
        raise ResumeParsingError(
            f"Could not download resume file: {e}"
        )


def _extract_pdf_text(file_bytes: bytes) -> str:
    # Convert the downloaded PDF bytes into readable text.
    try:
        # Read the PDF directly from memory without creating a temporary file.
        reader = PdfReader(io.BytesIO(file_bytes))

        # Extract text from every page and combine it into one string.
        return "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    # Convert PDF parsing errors into an AURA-specific error.
    except Exception as e:
        raise ResumeParsingError(
            f"Failed to parse PDF: {e}"
        )


def _extract_docx_text(file_bytes: bytes) -> str:
    # Convert the downloaded DOCX bytes into readable text.
    try:
        # Open the DOCX directly from memory.
        doc = Document(io.BytesIO(file_bytes))

        # Extract the text from every paragraph and combine it.
        return "\n".join(
            paragraph.text
            for paragraph in doc.paragraphs
        )

    # Convert DOCX parsing errors into an AURA-specific error.
    except Exception as e:
        raise ResumeParsingError(
            f"Failed to parse DOCX: {e}"
        )