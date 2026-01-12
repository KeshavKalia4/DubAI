from flask import Blueprint, request, jsonify
from services.follow_service import FollowService

follow_bp = Blueprint('follows', __name__)

#Follow a user
@follow_bp.route('/users', methods=['POST'])
def follow_user():
    try:
        data = request.json
        if not data.get('follower_netid') or not data.get('following_netid'):
            return jsonify({'error': 'follower_netid and following_netid are required'}), 400
        
        follow = FollowService.follow_user(
            follower_netid=data['follower_netid'],
            following_netid=data['following_netid']
        )
        return jsonify(follow), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Unfollow a user
@follow_bp.route('/users', methods=['DELETE'])
def unfollow_user():
    try:
        data = request.json
        if not data.get('follower_netid') or not data.get('following_netid'):
            return jsonify({'error': 'follower_netid and following_netid are required'}), 400
        
        success = FollowService.unfollow_user(
            follower_netid=data['follower_netid'],
            following_netid=data['following_netid']
        )
        if not success:
            return jsonify({'error': 'Failed to unfollow user'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get user's followers
@follow_bp.route('/users/<user_netid>/followers', methods=['GET'])
def get_followers(user_netid):
    try:
        followers = FollowService.get_followers(user_netid)
        return jsonify(followers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get users this user is following
@follow_bp.route('/users/<user_netid>/following', methods=['GET'])
def get_following(user_netid):
    try:
        following = FollowService.get_following(user_netid)
        return jsonify(following), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Check if user is following another user
@follow_bp.route('/users/<follower_netid>/is-following/<following_netid>', methods=['GET'])
def is_following(follower_netid, following_netid):
    try:
        is_following = FollowService.is_following(follower_netid, following_netid)
        return jsonify({'is_following': is_following}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get follower count for a user
@follow_bp.route('/users/<user_netid>/followers/count', methods=['GET'])
def get_follower_count(user_netid):
    try:
        count = FollowService.get_follower_count(user_netid)
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get following count for a user
@follow_bp.route('/users/<user_netid>/following/count', methods=['GET'])
def get_following_count(user_netid):
    try:
        count = FollowService.get_following_count(user_netid)
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Follow an RSO
@follow_bp.route('/rsos', methods=['POST'])
def follow_rso():
    try:
        data = request.json
        if not data.get('user_netid') or not data.get('rso_id'):
            return jsonify({'error': 'user_netid and rso_id are required'}), 400
        
        follow = FollowService.follow_rso(
            user_netid=data['user_netid'],
            rso_id=data['rso_id']
        )
        return jsonify(follow), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Unfollow an RSO
@follow_bp.route('/rsos', methods=['DELETE'])
def unfollow_rso():
    try:
        data = request.json
        if not data.get('user_netid') or not data.get('rso_id'):
            return jsonify({'error': 'user_netid and rso_id are required'}), 400
        
        success = FollowService.unfollow_rso(
            user_netid=data['user_netid'],
            rso_id=data['rso_id']
        )
        if not success:
            return jsonify({'error': 'Failed to unfollow RSO'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get RSOs user is following
@follow_bp.route('/users/<user_netid>/rsos', methods=['GET'])
def get_followed_rsos(user_netid):
    try:
        rsos = FollowService.get_followed_rsos(user_netid)
        return jsonify(rsos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get followers of an RSO
@follow_bp.route('/rsos/<rso_id>/followers', methods=['GET'])
def get_rso_followers(rso_id):
    try:
        followers = FollowService.get_rso_followers(rso_id)
        return jsonify(followers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Check if user is following an RSO
@follow_bp.route('/users/<user_netid>/is-following-rso/<rso_id>', methods=['GET'])
def is_following_rso(user_netid, rso_id):
    try:
        is_following = FollowService.is_following_rso(user_netid, rso_id)
        return jsonify({'is_following': is_following}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get follower count for an RSO
@follow_bp.route('/rsos/<rso_id>/followers/count', methods=['GET'])
def get_rso_follower_count(rso_id):
    try:
        count = FollowService.get_rso_follower_count(rso_id)
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get friends going to an event
@follow_bp.route('/events/<event_id>/friends/<user_netid>', methods=['GET'])
def get_friends_going_to_event(event_id, user_netid):
    try:
        friends = FollowService.get_friends_going_to_event(user_netid, event_id)
        return jsonify(friends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get RSVP count for an event
@follow_bp.route('/events/<event_id>/rsvp-count', methods=['GET'])
def get_event_rsvp_count(event_id):
    try:
        count = FollowService.get_event_rsvp_count(event_id)
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get events from RSOs user is following
@follow_bp.route('/users/<user_netid>/following-events', methods=['GET'])
def get_following_events(user_netid):
    try:
        limit = request.args.get('limit', 20, type=int)
        events = FollowService.get_following_events(user_netid, limit)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500