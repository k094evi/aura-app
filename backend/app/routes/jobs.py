# app/routes/jobs.py
from flask import Blueprint, jsonify
from app.data.job_requirements import JOB_REQUIREMENTS

jobs_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@jobs_bp.route('/supported', methods=['GET'])
def supported_jobs():
    return jsonify({'jobs': sorted(JOB_REQUIREMENTS.keys())}), 200