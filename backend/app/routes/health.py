# app/routes/health.py

from flask import Blueprint, jsonify


# Create the blueprint for the API health check.
health_bp = Blueprint(
    "health",
    __name__,
)


@health_bp.route("/health", methods=["GET"])
def health_check():
    # Return a simple response to confirm that Flask is running.
    return jsonify({
        "status": "ok"
    }), 200