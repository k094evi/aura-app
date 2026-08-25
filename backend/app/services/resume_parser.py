# app/services/resume_parser.py
import io
from pypdf import PdfReader
from docx import Document
from app.extensions.supabase_client import supabase


class ResumeParsingError(Exception):
    """Raised when a resume file can't be downloaded or its text extracted."""
    pass


def extract_text(storage_path: str) -> str:
    file_bytes = _download_resume_file(storage_path)
    extension = storage_path.rsplit('.', 1)[-1].lower()

    if extension == 'pdf':
        text = _extract_pdf_text(file_bytes)
    elif extension == 'docx':
        text = _extract_docx_text(file_bytes)
    else:
        raise ResumeParsingError(f"Unsupported file type: .{extension}")

    if not text or not text.strip():
        raise ResumeParsingError("No readable text found in this resume")

    return text


def _download_resume_file(storage_path: str) -> bytes:
    try:
        return supabase.storage.from_('resumes').download(storage_path)
    except Exception as e:
        raise ResumeParsingError(f"Could not download resume file: {e}")


def _extract_pdf_text(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        raise ResumeParsingError(f"Failed to parse PDF: {e}")


def _extract_docx_text(file_bytes: bytes) -> str:
    try:
        doc = Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)
    except Exception as e:
        raise ResumeParsingError(f"Failed to parse DOCX: {e}")