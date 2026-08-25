"""
database/models/resume_model.py
─────────────────────────────────
Data-access functions for the `resumes` table.
All DB writes in the parsing flow go through here.
"""

from typing import Optional
from app.schema.resume_schema import ParsedResumeSchema
from database.connection.db_config import get_supabase
from app.utils.logger import logger


def save_resume(
    parsed: ParsedResumeSchema,
    filename: str,
    user_id: Optional[str],
    target_job: str = "",
    target_companies: list[str] = [],
) -> str:
    """
    Inserts a parsed resume into the `resumes` table.
    Returns the new row's UUID.
    """
    db = get_supabase()

    row = {
        "user_id":              user_id,
        "filename":             filename,
        "file_type":            parsed.file_type,
        "raw_text":             parsed.raw_text,
        "contact_block":        parsed.contact_block,
        "summary_block":        parsed.summary_block,
        "experience_block":     parsed.experience_block,
        "education_block":      parsed.education_block,
        "skills_block":         parsed.skills_block,
        "projects_block":       parsed.projects_block,
        "certifications_block": parsed.certifications_block,
        "other_block":          parsed.other_block,
        "word_count":           parsed.word_count,
        "char_count":           parsed.char_count,
        "section_count":        parsed.section_count,
        "target_job":           target_job,
        "target_companies":     target_companies,
    }

    response = db.table("resumes").insert(row).execute()

    resume_id = response.data[0]["id"]
    logger.info(f"resume_model | saved | id={resume_id}")
    return resume_id


def get_resume_by_id(resume_id: str) -> Optional[dict]:
    db = get_supabase()
    result = db.table("resumes").select("*").eq("id", resume_id).single().execute()
    return result.data