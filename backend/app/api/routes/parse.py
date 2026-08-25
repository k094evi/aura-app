# ============================================================================
# FILE LOCATION : app/api/v1/endpoints/routes/parse.py
#                 (module docstring below states: routes/parse.py)
# ============================================================================
# PURPOSE:
#   Exposes a single HTTP endpoint, POST /api/v1/parse, that accepts a
#   resume file upload (PDF, DOC, or DOCX), validates it, hands it off to
#   the `resume_parser` service to extract structured data, and returns
#   that structured data as JSON.
#
# HOW IT FITS INTO THE PROGRAM:
#   - This is the first stage of a resume-processing pipeline. Per the
#     module docstring, later pipeline steps (scoring, keyword extraction)
#     will be added as additional endpoints alongside this one.
#   - The actual text-extraction/parsing logic lives in
#     `app.services.resume_parser.parse_resume` — this file's job is just
#     to handle the HTTP layer: validating the upload, enforcing size/type
#     limits, and converting errors into the right HTTP status codes.
#   - The shape of the returned JSON is defined by `ParsedResume` in
#     `app.models.schemas`.
#
# REQUEST/RESPONSE SUMMARY:
#   Request : multipart/form-data with a single "file" field.
#   Response: ParsedResume JSON — resume text split into sections
#             (contact, summary, experience, education, skills, projects,
#             certifications).
#
# VALIDATION RULES ENFORCED HERE:
#   - File extension must be one of: .pdf, .doc, .docx
#   - File must not be empty
#   - File must not exceed MAX_FILE_MB (10 MB)
# ============================================================================

"""
routes/parse.py
────────────────
POST /api/v1/parse

Accepts a multipart resume upload.
Runs the resume_parser service.
Returns a ParsedResume JSON object.

This is the only endpoint for now — scoring and keyword
extraction are added in subsequent pipeline steps.
"""

import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.services.resume_parser import parse_resume
from app.models.schemas import ParsedResume

logger = logging.getLogger(__name__)

router = APIRouter()

# --- Upload constraints -----------------------------------------------------
MAX_FILE_MB    = 10
MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024
ALLOWED_EXTS   = {".pdf", ".doc", ".docx"}


# ----------------------------------------------------------------------------
# POST /parse  (mounted at /api/v1/parse by whatever includes this router)
#
# Flow:
#   1. Validate the file extension against ALLOWED_EXTS.
#   2. Read the raw bytes of the upload.
#   3. Reject empty files and files over the size limit.
#   4. Call parse_resume(file_bytes, filename) to do the actual extraction.
#   5. Return the resulting ParsedResume object (FastAPI serializes it to JSON).
#
# Error handling:
#   - 422 Unprocessable Entity: bad extension, empty file, or a "human
#     readable" parsing failure (e.g. scanned/image-only PDF with no
#     extractable text) — these are expected/user-facing failure modes,
#     signaled by resume_parser raising ValueError.
#   - 413 Payload Too Large: file exceeds MAX_FILE_MB.
#   - 500 Internal Server Error: anything unexpected, logged with a full
#     stack trace via logger.exception for debugging, but the client only
#     sees a generic message (no internal details leaked).
# ----------------------------------------------------------------------------
@router.post(
    "/parse",
    response_model=ParsedResume,
    summary="Parse a resume file",
    description=(
        "Upload a PDF or Word resume. "
        "Returns the extracted text split into named sections "
        "(contact, summary, experience, education, skills, projects, certifications)."
    ),
)
async def parse_resume_endpoint(
    file: UploadFile = File(..., description="Resume file — PDF, DOCX, or DOC"),
):
    # ── Validate extension ────────────────────────────────────────────────
    # Pull the extension off the filename (e.g. "resume.pdf" -> ".pdf").
    # If there's no "." in the filename at all, ext ends up as "" and will
    # correctly fail the ALLOWED_EXTS check below.
    filename = file.filename or ""
    ext = ("." + filename.rsplit(".", 1)[-1].lower()) if "." in filename else ""

    if ext not in ALLOWED_EXTS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{ext}' is not supported. Upload a .pdf, .docx, or .doc file.",
        )

    # ── Read bytes ────────────────────────────────────────────────────────
    # Read the entire upload into memory. Fine for resume-sized files given
    # the 10 MB cap enforced just below.
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded file is empty.",
        )

    if len(file_bytes) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the {MAX_FILE_MB} MB limit.",
        )

    # ── Parse ─────────────────────────────────────────────────────────────
    # Delegate the actual text extraction / section-splitting to the
    # resume_parser service. That service is expected to raise ValueError
    # for "expected" failures (e.g. couldn't extract any text from an
    # image-only PDF) so we can surface a clean 422 with a helpful message,
    # as opposed to unexpected exceptions which become a generic 500.
    try:
        result = parse_resume(file_bytes, filename)
    except ValueError as exc:
        # Human-readable parse errors (image PDF, empty file, etc.)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    except Exception as exc:
        # Catch-all for anything unforeseen; log full details server-side
        # but keep the client-facing message generic.
        logger.exception(f"Unexpected parse error for {filename!r}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while parsing the file.",
        )

    return result