# ============================================================================
# FILE LOCATION : app/controllers/parsing_controller.py
# ============================================================================
# PURPOSE:
#   A thin coordination layer for the resume-parsing-only flow (as opposed
#   to the full analyze/matching flow in analyze_controller.py). Sits
#   between the HTTP route and the resume_parser service.
#
#   Per the module's own docstring: "Sits between the route and the
#   service. Handles file validation, calls resume_parser, returns the
#   schema."
#
# HOW IT FITS INTO THE PROGRAM:
#   - Called by whatever route handles POST /parse (or similar) — that
#     route passes the raw UploadFile in and returns whatever this
#     function returns (or lets the raised HTTPException propagate).
#   - Delegates size/MIME-type validation to
#     app.utils.file_handler.validate_file (note: this is a separate,
#     more thorough validator than the simple extension check seen in
#     other parse endpoints in this codebase — it also determines the
#     concrete `file_type`, which is then passed into parse_resume).
#   - Delegates the actual text extraction to
#     app.services.resume_parser.parse_resume, same as the other parse
#     entry points, but note the extra `file_type` argument here — this
#     resume_parser call signature differs slightly from the one used in
#     analyze_controller.py (which doesn't pass file_type). Worth
#     double-checking that resume_parser.parse_resume's real signature
#     supports both call patterns.
#   - Returns a `ParsedResumeSchema` (from app.schema.resume_schema),
#     which is a different schema class than `ParsedResume` used
#     elsewhere in the project (app.models.schemas) — likely worth
#     reconciling if both are meant to represent the same data.
#
# ERROR HANDLING:
#   - ValueError from validate_file() or parse_resume() -> 422
#     (expected/user-facing failure: bad file, unparsable content, etc.)
#   - Any other exception from parse_resume() -> 500, logged with full
#     traceback via logger.exception, generic message to the client.
# ============================================================================

"""
controllers/parsing_controller.py
───────────────────────────────────
Sits between the route and the service.
Handles file validation, calls resume_parser, returns the schema.
"""

from fastapi import UploadFile, HTTPException, status

from app.utils.file_handler import validate_file
from app.services.resume_parser import parse_resume
from app.schema.resume_schema import ParsedResumeSchema
from app.utils.logger import logger


# ----------------------------------------------------------------------------
# handle_parse  —  entry point called by the /parse route
#
# Step-by-step:
#   1. Read the raw bytes of the uploaded file (falls back to "upload" as
#      a filename if none was provided by the client).
#   2. Validate the file (size + MIME type) via validate_file(), which
#      also returns the detected `file_type` (used to tell parse_resume
#      how to interpret the bytes, e.g. "pdf" vs "docx").
#      -> ValueError here means the file itself is invalid -> 422.
#   3. Call parse_resume(file_bytes, filename, file_type) to extract the
#      resume's structured content.
#      -> ValueError here means parsing failed in an expected way
#         (e.g. no extractable text) -> 422.
#      -> Any other exception is unexpected -> logged, then 500.
#   4. On success, log a short summary (word count) and return the
#      resulting ParsedResumeSchema object.
# ----------------------------------------------------------------------------
async def handle_parse(file: UploadFile) -> ParsedResumeSchema:
    """
    Called by the /parse route.
    1. Reads and validates the uploaded file.
    2. Delegates to resume_parser service.
    3. Returns ParsedResumeSchema or raises HTTPException.
    """
    filename = file.filename or "upload"
    file_bytes = await file.read()

    # Validate size + MIME type
    try:
        file_type = validate_file(file_bytes, filename)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )

    # Parse
    try:
        result = parse_resume(file_bytes, filename, file_type)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception(f"Unexpected parse error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while parsing the resume.",
        )

    logger.info(f"parsing_controller | success | words={result.word_count}")
    return result