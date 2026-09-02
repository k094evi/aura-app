# app/controllers/resume_controller.py

from flask import request, jsonify

from app.services import auth_service, resume_service

from app.services.resume_parser import (
    extract_text,
    ResumeParsingError,
)

from app.services.skill_extractor import extract_skills

from app.services.skill_gap import (
    calculate_skill_gap,
    UnknownJobError,
)

from app.services.certification_engine import recommend_certifications

from app.services.certificate_extractor import extract_certifications


def analyze_resume(resume_id: str):
    # Verify that the request comes from an authenticated user.
    user = auth_service.get_authenticated_user(request)

    # Reject requests without a valid Supabase access token.
    if user is None:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    # Find the requested resume in the database.
    resume = resume_service.get_resume(resume_id)

    # Return 404 when the resume does not exist.
    if resume is None:
        return jsonify({
            "error": "Resume not found"
        }), 404

    # Prevent users from analyzing another user's resume.
    if resume["user_id"] != user.id:
        return jsonify({
            "error": "Forbidden"
        }), 403

    # Mark the resume as processing before analysis begins.
    resume_service.update_status(
        resume_id,
        "processing",
    )

    try:
        # Download and extract readable text from the resume.
        text = extract_text(
            resume["storage_path"]
        )

        # Detect supported skills inside the resume text.
        skills = extract_skills(text)

        # Detect supported certifications inside the resume text.
        certifications_found = extract_certifications(text)

        # Compare resume skills against the selected job requirements.
        gap = calculate_skill_gap(
            resume["target_job"],
            skills,
        )

        # Compare resume certifications against the selected job requirements.
        certifications = recommend_certifications(
            resume["target_job"],
            certifications_found,
        )

    # Mark the resume as failed when parsing or downloading fails.
    except ResumeParsingError as e:
        resume_service.update_status(
            resume_id,
            "failed",
        )

        return jsonify({
            "error": str(e)
        }), 422

    # Mark the resume as failed when its target job is unsupported.
    except UnknownJobError as e:
        resume_service.update_status(
            resume_id,
            "failed",
        )

        return jsonify({
            "error": str(e)
        }), 404

    # Combine all analysis results into one response object.
    result = {
        "skills": skills,
        "skill_gap": gap,
        "certifications": certifications,
    }

    # Save the completed analysis and update the resume status.
    resume_service.save_analysis(
        resume_id,
        result,
    )

    # Return the analysis results to the frontend.
    return jsonify(result), 200