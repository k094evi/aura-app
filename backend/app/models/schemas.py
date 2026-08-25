# ============================================================================
# FILE LOCATION : app/models/schemas.py
# ============================================================================
# PURPOSE:
#   Defines the Pydantic model that represents a fully parsed resume —
#   the raw extracted text plus that text broken out into named sections
#   (contact, summary, experience, education, skills, projects,
#   certifications), along with a few basic stats (word/char/section
#   counts) and which file type it came from.
#
# HOW IT FITS INTO THE PROGRAM:
#   - This is the `response_model` returned by the /parse endpoint in
#     app/api/v1/endpoints/routes/parse.py, and it's the return type
#     produced by app.services.resume_parser.parse_resume(...).
#   - NOTE — resolves a naming question from the controllers: this file
#     defines `ParsedResumeSchema` as a plain alias of `ParsedResume`
#     (`ParsedResumeSchema = ParsedResume`), i.e. they are literally the
#     *same class* under two different names. So `parsing_controller.py`
#     (which imports `ParsedResumeSchema` from app.schema.resume_schema)
#     and the plain `/parse` route (which imports `ParsedResume` from
#     here, app.models.schemas) may end up pointing at two *different*
#     files/classes that just happen to share a name pattern — worth
#     double-checking that `app.schema.resume_schema.ParsedResumeSchema`
#     is actually this same class and not a separate, similarly-named
#     definition living in a different module.
#   - All the `*_block` fields are Optional because a given resume might
#     not have every section (e.g. no "projects" section) — the parser
#     only fills in the blocks it actually finds.
# ============================================================================

# app/models/schemas.py
from pydantic import BaseModel
from typing import Optional


# The structured result of parsing one resume file.
class ParsedResume(BaseModel):
    # Full extracted text, unsplit — useful as a fallback / for keyword
    # search across the whole document.
    raw_text: str

    # Individual sections, each optional since not every resume contains
    # every section. These are populated by resume_parser's section-
    # splitting logic.
    contact_block: Optional[str] = None
    summary_block: Optional[str] = None
    experience_block: Optional[str] = None
    education_block: Optional[str] = None
    skills_block: Optional[str] = None
    projects_block: Optional[str] = None
    certifications_block: Optional[str] = None
    other_block: Optional[str] = None  # catch-all for unrecognized content

    # Basic stats about the parsed document.
    word_count: int
    char_count: int
    section_count: int   # how many of the *_block fields were populated

    # Original file type (e.g. "pdf", "docx", "doc") — lets downstream
    # code/analytics know what kind of file was uploaded.
    file_type: str


# Alias so both names refer to the same class.
# i.e. `ParsedResumeSchema` and `ParsedResume` are interchangeable — this
# line does NOT create a new/different schema, it just gives the same
# class a second name for import convenience.
ParsedResumeSchema = ParsedResume