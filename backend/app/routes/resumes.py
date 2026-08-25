from flask import Blueprint
from app.controllers import resume_controller

resumes_bp = Blueprint(
    'resumes',
    __name__,
    url_prefix='/api/resumes'
)


@resumes_bp.route('/<resume_id>/analyze', methods=['POST'])
def analyze(resume_id):
    return resume_controller.analyze_resume(resume_id)