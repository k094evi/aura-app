"""
FILE LOCATION: app/utils/file_handler.py
─────────────────────────────────────────

PURPOSE
-------
This module is the "gatekeeper" for any file a user uploads to the resume
parsing feature. Before an uploaded file is ever handed to the actual
resume-parsing logic, it passes through `validate_file()` here, which
checks:
  1. That the file isn't empty.
  2. That the file isn't larger than the app-wide size limit.
  3. That the file is actually a PDF or Word document (not some other
     file type that was simply renamed to look like one).

HOW IT FITS INTO THE PROGRAM
-----------------------------
- `app/config.py` supplies the configurable limits (`MAX_UPLOAD_MB`,
  `ALLOWED_EXTENSIONS`) so they can be tuned in one place instead of
  being hard-coded here.
- `app/utils/logger.py` supplies the shared `logger` object used for
  debug logging in this module (see logger.py for details).
- The resume parser (elsewhere in the app) is expected to call
  `validate_file(file_bytes, filename)` first. If it raises a
  `ValueError`, that message is meant to be shown directly to the user
  (it's written to be friendly, not a stack trace).

WHY TWO DETECTION METHODS (MIME vs EXTENSION)?
-----------------------------------------------
The strongest way to know a file's real type is to inspect its bytes
with `python-magic` (which reads the file's internal signature, not
just its name). However, `python-magic` relies on the system library
`libmagic`, which isn't always installed (especially on Windows, where
it needs the separate `python-magic-bin` package) and isn't currently
listed in requirements.txt. So this function:
  - Tries `python-magic` first, for accurate detection.
  - Silently falls back to trusting the file's extension if `magic`
    isn't available or fails, so the upload flow doesn't break in
    environments where that system dependency is missing.
"""

from app.config import settings
from app.utils.logger import logger

# Maps the MIME types python-magic can detect back to the short file
# extension the rest of the app uses internally ('pdf', 'docx', 'doc').
MIME_TO_EXT = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
}


def validate_file(file_bytes: bytes, filename: str) -> str:
    """
    Validates size and type of the uploaded file.
    Returns the detected file extension ('pdf' / 'docx' / 'doc').
    Raises ValueError with a user-friendly message on failure.
    """
    # Convert the configured MB limit into raw bytes for comparison.
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024

    # --- Check 1: reject empty uploads ---
    if not file_bytes:
        raise ValueError("The uploaded file is empty.")

    # --- Check 2: reject files over the configured size limit ---
    if len(file_bytes) > max_bytes:
        raise ValueError(
            f"File is too large. Maximum allowed size is {settings.MAX_UPLOAD_MB} MB."
        )

    # --- Check 3: determine the real file type ---
    # python-magic depends on the system libmagic library, which is a pain
    # to install on Windows (needs python-magic-bin) and isn't in
    # requirements.txt yet. Try it if it's available for stronger
    # detection; fall back to extension-based checking otherwise so this
    # route works regardless of whether that system dependency is set up.
    mime = None
    try:
        import magic
        mime = magic.from_buffer(file_bytes, mime=True)
    except Exception as exc:
        # Not a fatal error — just means we lose the stronger detection
        # and fall through to the extension-based check below.
        logger.debug(f"file_handler | magic unavailable, using extension fallback: {exc}")

    logger.debug(f"file_handler | file={filename!r} | mime={mime}")

    # Preferred path: we got a recognized MIME type from python-magic.
    if mime in MIME_TO_EXT:
        return MIME_TO_EXT[mime]

    # Fallback path: trust extension if magic is unavailable or returns
    # something generic/unrecognized (e.g. "application/octet-stream").
    ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
    if f".{ext}" in settings.ALLOWED_EXTENSIONS:
        return ext

    # Neither detection method could confirm a supported type — reject.
    raise ValueError(
        "Unsupported file type. Please upload a PDF (.pdf) or Word document (.docx / .doc)."
    )