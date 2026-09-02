from app.extensions.supabase_client import supabase


def get_resume(resume_id: str) -> dict | None:
    # Find one resume record using its unique ID.
    response = (
        supabase.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .maybe_single()
        .execute()
    )

    # Return None when no valid resume record was found.
    if response is None or not isinstance(response.data, dict):
        return None

    # Return the resume database record.
    return response.data


def update_status(resume_id: str, status: str):
    # Update the processing status of the resume.
    supabase.table("resumes").update(
        {"status": status}
    ).eq(
        "id",
        resume_id
    ).execute()


def save_analysis(resume_id: str, result: dict) -> None:
    # Save the completed analysis and mark the resume as completed.
    supabase.table("resumes").update({
        "status": "completed",
        "analysis_result": result,
    }).eq(
        "id",
        resume_id
    ).execute()