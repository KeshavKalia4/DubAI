from flask import Blueprint, request, jsonify
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get high-level stats. Optional ?rso_id= query param."""
    try:
        rso_id = request.args.get('rso_id')
        summary = AnalyticsService.get_summary(rso_id)
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/rsvp-by-event', methods=['GET'])
def get_rsvp_by_event():
    """Get RSVP counts per event. Optional ?rso_id=&limit="""
    try:
        rso_id = request.args.get('rso_id')
        limit = request.args.get('limit', 10, type=int)
        data = AnalyticsService.get_rsvp_by_event(rso_id, limit)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/users/total', methods=['GET'])
def get_total_users():
    """Get total registered user count."""
    try:
        total = AnalyticsService.get_total_users()
        return jsonify({'total': total}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
