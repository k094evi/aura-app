# app/routes/resumes.py

from flask import Blueprint

from app.controllers import resume_controller


# Create the blueprint for resume-related API endpoints.
resumes_bp = Blueprint(
    "resumes",
    __name__,
    url_prefix="/api/resumes",
)


@resumes_bp.route("/<resume_id>/analyze", methods=["POST"])
def analyze(resume_id):
    # Pass the resume ID to the controller that handles the analysis.
    return resume_controller.analyze_resume(resume_id)