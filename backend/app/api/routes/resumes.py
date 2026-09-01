# FILE LOCATION: app/api/routes/resumes.py
"""
Migrated from backend_2:
  - app/routes/resumes.py       (Flask blueprint -> FastAPI router)
  - app/controllers/resume_controller.py  (view logic)
  - app/services/resume_service.py        (get_resume lookup)

Ownership check (resume.user_id == current user) is preserved from
backend_2 — that part was good and is kept as-is, just re-expressed with
HTTPException instead of jsonify(...), CODE.

NOT migrated: resume_parser.py's storage-download path. Your `resumes`
table already stores raw_text/skills_block from the original parse
(see app/controllers/analyze_controller.py), so there's no need to
re-download and re-parse the file — we just re-read the stored columns.
"""

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.models.auth_schemas import AuthUser
from app.extensions.supabase_client import supabase
from app.services.target_job_matcher import calculate_target_job_gap_from_row

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.get("/{resume_id}/analyze", summary="Re-fetch a stored resume's target-job skill gap")
def analyze_stored_resume(resume_id: str, user: AuthUser = Depends(get_current_user)):
    response = (
        supabase.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .maybe_single()
        .execute()
    )
    row = response.data if response else None

    if not row:
        raise HTTPException(404, "Resume not found")
    if row["user_id"] != user.id:
        raise HTTPException(403, "Forbidden")

    gap = calculate_target_job_gap_from_row(row.get("target_job", ""), row)
    if gap is None:
        raise HTTPException(
            404,
            f"'{row.get('target_job')}' isn't a supported target job for this check.",
        )

    return {"resume_id": resume_id, "target_job_gap": gap}