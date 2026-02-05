from flask import Blueprint, request, jsonify
from services.contributor_service import ContributorService
from services.user_service import UserService

contributor_bp = Blueprint('contributors', __name__)


# ============================================
# USER ENDPOINTS
# ============================================

@contributor_bp.route('/request', methods=['POST'])
def create_request():
    """Create a new contributor verification request"""
    data = request.json
    try:
        result = ContributorService.create_request(
            user_netid=data['user_netid'],
            rso_name=data['rso_name'],
            reason=data['reason'],
            proof=data.get('proof'),
            rso_id=data.get('rso_id')
        )
        if result:
            return jsonify(result), 201
        return jsonify({'error': 'Failed to create request'}), 500
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contributor_bp.route('/user/<netid>/status', methods=['GET'])
def get_user_status(netid):
    """Get contributor status and pending requests for a user"""
    status = UserService.get_contributor_status(netid)
    requests = ContributorService.get_user_requests(netid)

    # Find most recent pending request
    pending_request = next((r for r in requests if r['status'] == 'pending'), None)

    return jsonify({
        'is_contributor': status['is_contributor'],
        'is_admin': status['is_admin'],
        'pending_request': pending_request,
        'requests': requests
    }), 200


@contributor_bp.route('/user/<netid>/requests', methods=['GET'])
def get_user_requests(netid):
    """Get all contributor requests for a user"""
    requests = ContributorService.get_user_requests(netid)
    return jsonify(requests), 200


# ============================================
# ADMIN ENDPOINTS
# ============================================

@contributor_bp.route('/admin/pending', methods=['GET'])
def get_pending_requests():
    """Get all pending contributor requests (admin only)"""
    limit = request.args.get('limit', 50, type=int)
    requests = ContributorService.get_pending_requests(limit)
    return jsonify(requests), 200


@contributor_bp.route('/admin/all', methods=['GET'])
def get_all_requests():
    """Get all contributor requests with optional status filter (admin only)"""
    status = request.args.get('status')
    limit = request.args.get('limit', 100, type=int)
    requests = ContributorService.get_all_requests(status, limit)
    return jsonify(requests), 200


@contributor_bp.route('/admin/<request_id>/approve', methods=['POST'])
def approve_request(request_id):
    """Approve a contributor request (admin only)"""
    data = request.json
    admin_netid = data.get('admin_netid')
    admin_notes = data.get('admin_notes')

    if not admin_netid:
        return jsonify({'error': 'admin_netid is required'}), 400

    # Verify admin status
    status = UserService.get_contributor_status(admin_netid)
    if not status['is_admin']:
        return jsonify({'error': 'Unauthorized: not an admin'}), 403

    result = ContributorService.approve_request(request_id, admin_netid, admin_notes)
    if result:
        return jsonify(result), 200
    return jsonify({'error': 'Request not found'}), 404


@contributor_bp.route('/admin/<request_id>/deny', methods=['POST'])
def deny_request(request_id):
    """Deny a contributor request (admin only)"""
    data = request.json
    admin_netid = data.get('admin_netid')
    admin_notes = data.get('admin_notes')

    if not admin_netid:
        return jsonify({'error': 'admin_netid is required'}), 400

    # Verify admin status
    status = UserService.get_contributor_status(admin_netid)
    if not status['is_admin']:
        return jsonify({'error': 'Unauthorized: not an admin'}), 403

    result = ContributorService.deny_request(request_id, admin_netid, admin_notes)
    if result:
        return jsonify(result), 200
    return jsonify({'error': 'Request not found'}), 404
