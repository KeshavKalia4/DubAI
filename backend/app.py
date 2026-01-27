from flask import Flask
from flask_cors import CORS

from routes import api_bp


def create_app() -> Flask:
    application = Flask(__name__)
    CORS(application)
    application.register_blueprint(api_bp, url_prefix="/api")
    return application


# Create app instance for gunicorn (gunicorn app:app)
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

