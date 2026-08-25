from flask import request, jsonify

from app.services import auth_service, resume_service
from app.services.resume_parser import extract_text, ResumeParsingError
from app.services.skill_extractor import extract_skills
from app.services.skill_gap import calculate_skill_gap, UnknownJobError

def analyze_resume(resume_id: str):
    user = auth_service.get_authenticated_user(request)
    if user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    resume = resume_service.get_resume(resume_id)
    if resume is None:
        return jsonify({'error': 'Resume not found'}), 404

    if resume['user_id'] != user.id:
        return jsonify({'error': 'Forbidden'}), 403

    try:
        text = extract_text(resume['storage_path'])
        skills = extract_skills(text)
        gap = calculate_skill_gap(resume['target_job'], skills)
    except ResumeParsingError as e:
        return jsonify({'error': str(e)}), 422
    except UnknownJobError as e:
        return jsonify({'error': str(e)}), 404

    return jsonify({
        'skills': skills,
        'skill_gap': gap,
    }), 200