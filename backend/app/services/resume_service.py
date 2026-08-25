from app.extensions.supabase_client import supabase


def get_resume(resume_id: str) -> dict | None:
    response = (
        supabase.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .maybe_single()
        .execute()
    )

    if response is None or not isinstance(response.data, dict):
        return None

    return response.data