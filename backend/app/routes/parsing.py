# ==============================================================================
# FILE: app/routes/parsing.py  (adjust path if this lives elsewhere, e.g.
#       app/routers/parsing.py — wherever your other route files live)
# ==============================================================================
# PURPOSE OF THIS FILE:
#   This file defines the API route(s) for resume parsing. It's the "front
#   door" that clients (the frontend, Postman, etc.) actually hit over HTTP —
#   it doesn't do the parsing work itself. Its only jobs are to:
#     1. Declare the URL path, HTTP method, and docs metadata for the
#        endpoint.
#     2. Accept the uploaded file from the request.
#     3. Hand that file off to the controller (`handle_parse`) which
#        contains the real parsing logic.
#     4. Return whatever the controller gives back, shaped to match
#        `ParsedResumeSchema` so FastAPI can validate/serialize it and show
#        it correctly in the auto-generated docs (/docs).
#
#   This "route calls controller" split keeps HTTP concerns (paths, request
#   parsing, response models) separate from business logic (actually reading
#   and structuring the resume), which is why `handle_parse` lives in
#   app/controllers/parsing_controller.py instead of here.
#
# HOW THIS ENDPOINT IS USED:
#   A client sends a multipart/form-data POST request to:
#       POST /parsing/parse
#   with a "file" field containing a PDF, DOCX, or DOC resume.
#   The response comes back matching `ParsedResumeSchema` — the resume's
#   text broken into named sections: contact, summary, experience,
#   education, skills, projects, certifications.
#
# NOTE ON AUTH:
#   This route is not currently protected by `Depends(get_current_user)`
#   (see app/dependencies/auth.py). If resume parsing should only be
#   available to logged-in users, add that dependency to the endpoint
#   signature.
# ==============================================================================

from fastapi import APIRouter, File, UploadFile
from app.controllers.parsing_controller import handle_parse
from app.schema.resume_schema import ParsedResumeSchema

# `router` groups every endpoint defined in this file under the "/parsing"
# URL prefix and tags them "Parsing" in the auto-generated Swagger/OpenAPI
# docs. This router gets included into the main FastAPI app elsewhere
# (typically in app/main.py via `app.include_router(router)`).
router = APIRouter(prefix="/parsing", tags=["Parsing"])


@router.post(
    "/parse",
    # `response_model` tells FastAPI what shape the response should be
    # validated and serialized against. If `handle_parse` returns something
    # that doesn't match ParsedResumeSchema, FastAPI will raise an error
    # rather than silently returning malformed data.
    response_model=ParsedResumeSchema,
    # `summary` and `description` show up in the auto-generated API docs
    # (visit /docs) so other developers (or the frontend team) know what
    # this endpoint does without reading the code.
    summary="Parse a resume",
    description=(
        "Extracts and structures text from a PDF or DOCX resume. "
        "Returns cleaned text split into named sections: "
        "contact, summary, experience, education, skills, projects, certifications."
    ),
)
async def parse_resume_endpoint(
    # `File(...)` marks this as a required file upload (multipart/form-data),
    # not a JSON body field. `UploadFile` gives access to the file's
    # filename, content type, and an async-readable stream — without
    # loading the whole file into memory up front.
    file: UploadFile = File(..., description="Resume file — PDF, DOCX, or DOC"),
):
    # All the real work — detecting file type, extracting text, splitting
    # it into sections — happens inside handle_parse(). This route function
    # stays thin on purpose: its only responsibility is wiring the incoming
    # HTTP request to that controller function and returning its result.
    return await handle_parse(file)