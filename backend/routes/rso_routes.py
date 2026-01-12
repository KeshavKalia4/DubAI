from flask import Blueprint, request, jsonify
from services.rso_service import RSOService

rso_bp = Blueprint('rsos', __name__)


#Create a new RSO
@rso_bp.route('/', methods=['POST'])
def create_rso():
    try:
        data = request.json
        if not data.get('name'):
            return jsonify({'error': 'name is required'}), 400
        
        rso = RSOService.create_rso(
            name=data['name'],
            description=data.get('description'),
            is_verified=data.get('is_verified', False)
        )
        return jsonify(rso), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#Get RSO by ID
@rso_bp.route('/<rso_id>', methods=['GET'])
def get_rso(rso_id):
    try:
        rso = RSOService.get_rso(rso_id)
        if not rso:
            return jsonify({'error': 'RSO not found'}), 404
        return jsonify(rso), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get RSO by name
@rso_bp.route('/name/<name>', methods=['GET'])
def get_rso_by_name(name):
    try:
        rso = RSOService.get_rso_by_name(name)
        if not rso:
            return jsonify({'error': 'RSO not found'}), 404
        return jsonify(rso), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get all RSOs
@rso_bp.route('/', methods=['GET'])
def get_all_rsos():
    try:
        verified_only = request.args.get('verified_only', 'false').lower() == 'true'
        rsos = RSOService.get_all_rsos(verified_only)
        return jsonify(rsos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Search RSOs by name
@rso_bp.route('/search', methods=['GET'])
def search_rsos():
    try:
        search_term = request.args.get('q')
        if not search_term:
            return jsonify({'error': 'q query param is required'}), 400
        
        rsos = RSOService.search_rsos(search_term)
        return jsonify(rsos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get RSO's events
@rso_bp.route('/<rso_id>/events', methods=['GET'])
def get_rso_events(rso_id):
    try:
        upcoming_only = request.args.get('upcoming_only', 'true').lower() == 'true'
        events = RSOService.get_rso_events(rso_id, upcoming_only)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#Update RSO
@rso_bp.route('/<rso_id>', methods=['PUT'])
def update_rso(rso_id):
    try:
        data = request.json
        rso = RSOService.update_rso(rso_id, **data)
        if not rso:
            return jsonify({'error': 'RSO not found'}), 404
        return jsonify(rso), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Verify RSO
@rso_bp.route('/<rso_id>/verify', methods=['PUT'])
def verify_rso(rso_id):
    try:
        rso = RSOService.verify_rso(rso_id)
        if not rso:
            return jsonify({'error': 'RSO not found'}), 404
        return jsonify(rso), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#Delete RSO
@rso_bp.route('/<rso_id>', methods=['DELETE'])
def delete_rso(rso_id):
    try:
        success = RSOService.delete_rso(rso_id)
        if not success:
            return jsonify({'error': 'Failed to delete RSO'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500