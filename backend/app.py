# backend/app.py
from flask import Flask
from flask_cors import CORS

from routes import api_bp


def create_app() -> Flask:
    """Application factory for the backend service."""
    app = Flask(__name__)
    CORS(app)

    # Mount all API routes under /api
    app.register_blueprint(api_bp, url_prefix="/api")
    return app


if __name__ == "__main__":
    app = create_app()
    # Bind to 0.0.0.0 for container support if needed
    app.run(host="0.0.0.0", port=5000, debug=True)