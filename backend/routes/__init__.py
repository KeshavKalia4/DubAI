from flask import Blueprint

from .user_routes import user_bp
from .chat_routes import chat_bp
from .event_routes import event_bp
from .follow_routes import follow_bp
from .rso_routes import rso_bp
from .tag_routes import tag_bp
from .contributor_routes import contributor_bp
from .analytics_routes import analytics_bp

api_bp = Blueprint('api', __name__)

api_bp.register_blueprint(user_bp, url_prefix='/users')
api_bp.register_blueprint(chat_bp, url_prefix='/chats')
api_bp.register_blueprint(event_bp, url_prefix='/events')
api_bp.register_blueprint(follow_bp, url_prefix='/follows')
api_bp.register_blueprint(rso_bp, url_prefix='/rsos')
api_bp.register_blueprint(tag_bp, url_prefix='/tags')
api_bp.register_blueprint(contributor_bp, url_prefix='/contributors')
api_bp.register_blueprint(analytics_bp, url_prefix='/analytics')

