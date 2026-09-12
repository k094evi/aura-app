# ==============================================================================
# FILE LOCATION: app/api/routes/resumes.py
# ==============================================================================

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.models.auth_schemas import AuthUser
from app.extensions.supabase_client import supabase_admin
from app.services.target_job_matcher import calculate_target_job_gap_from_row


# ------------------------------------------------------------------------------
# Router
# ------------------------------------------------------------------------------
router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"],
)


# ------------------------------------------------------------------------------
# GET /resumes/{resume_id}/analyze
# ------------------------------------------------------------------------------
@router.get(
    "/{resume_id}/analyze",
    summary="Re-fetch a stored resume's target-job skill gap",
)
def analyze_stored_resume(
    resume_id: str,
    user: AuthUser = Depends(get_current_user),
):
    # --------------------------------------------------------------------------
    # Query the resume.
    # --------------------------------------------------------------------------
    response = (
        supabase_admin.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", user.id)
        .maybe_single()
        .execute()
    )

    # --------------------------------------------------------------------------
    # Get the returned data.
    #
    # getattr() is used because the Supabase type checker is incorrectly
    # treating the response object as potentially None.
    # --------------------------------------------------------------------------
    data: Any = getattr(response, "data", None)

    # --------------------------------------------------------------------------
    # Make sure Supabase actually returned a dictionary/object row.
    # --------------------------------------------------------------------------
    if not isinstance(data, dict):
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    # --------------------------------------------------------------------------
    # At this point the type checker knows that data is a dictionary.
    # --------------------------------------------------------------------------
    row: Dict[str, Any] = data

    # --------------------------------------------------------------------------
    # Get the target job stored with the resume.
    # --------------------------------------------------------------------------
    target_job = row.get("target_job", "")

    # --------------------------------------------------------------------------
    # Calculate the target-job skill gap.
    # --------------------------------------------------------------------------
    gap = calculate_target_job_gap_from_row(
        target_job,
        row,
    )

    # --------------------------------------------------------------------------
    # Unsupported or missing target job.
    # --------------------------------------------------------------------------
    if gap is None:
        raise HTTPException(
            status_code=404,
            detail=f"'{target_job}' isn't a supported target job for this check.",
        )

    # --------------------------------------------------------------------------
    # Return the result.
    # --------------------------------------------------------------------------
    return {
        "resume_id": resume_id,
        "target_job_gap": gap,
    }