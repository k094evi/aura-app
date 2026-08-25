from flask import Flask
from flask_cors import CORS

from app.config import Config, validate_env
from app.routes.health import health_bp
from app.routes.jobs import jobs_bp
from app.routes.resumes import resumes_bp


def create_app():
    validate_env()
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=["http://localhost:3000"])

    app.register_blueprint(health_bp)
    app.register_blueprint(resumes_bp)
    app.register_blueprint(jobs_bp)

    return app