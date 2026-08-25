# app/schema/resume_schema.py

from app.models.schemas import ParsedResume

# Single source of truth — tests import ParsedResumeSchema from here,
# parser returns ParsedResume; isinstance() passes because they're the same object.
ParsedResumeSchema = ParsedResume