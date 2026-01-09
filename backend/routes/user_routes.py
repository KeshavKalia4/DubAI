from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('users', __name__)

# Create a new user
@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    user = UserService.create_user(
        netid=data['netid'],
        name=data['name'],
        email=data['email'],
        major=data.get('major'),
        year=data.get('year')
    )
    return jsonify(user), 201

# Complete onboarding
@user_bp.route('/<netid>/onboarding', methods=['POST'])
def complete_onboarding(netid):
    data = request.json
    user = UserService.complete_onboarding(
        netid=netid,
        major=data['major'],
        year=data['year'],
        selected_tags=data['selected_tags']
    )
    return jsonify(user), 200

# Get a user
@user_bp.route('/<netid>', methods=['GET'])
def get_user(netid):
    user = UserService.get_user(netid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

# Get a user with tags
@user_bp.route('/<netid>/tags', methods=['GET'])
def get_user_with_tags(netid):
    user = UserService.get_user_with_tags(netid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200   

# Check if user exists
@user_bp.route('/<netid>/exists', methods=['GET'])
def check_user_exists(netid):
    user = UserService.check_user_exists(netid)
    return jsonify(user), 200

# Update a user
@user_bp.route('/<netid>', methods=['PUT'])
def update_user(netid):
    data = request.json
    user = UserService.update_user(netid, **data)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

# Update last active
@user_bp.route('/<netid>/last-active', methods=['PUT'])
def update_last_active(netid):
    user = UserService.update_last_active(netid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

# Delete a user
@user_bp.route('/<netid>', methods=['DELETE'])
def delete_user(netid):
    user = UserService.delete_user(netid)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200   


