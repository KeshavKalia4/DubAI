from flask import Blueprint, request, jsonify
from services.event_service import EventService

event_bp = Blueprint('events', __name__)

#Creating event
@event_bp.route('/', methods=['POST'])
def create_event():
    try:
        data = request.json
        required = ['rso_id', 'title', 'description', 'date_time', 'location', 'tags']
        if not all(data.get(field) for field in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        event = EventService.create_event(
            rso_id=data['rso_id'],
            title=data['title'],
            description=data['description'],
            date_time=data['date_time'],
            location=data['location'],
            tags=data['tags']
        )
        return jsonify(event), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#Get event
@event_bp.route('/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = EventService.get_event(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        return jsonify(event), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get upcoming events
@event_bp.route('/upcoming', methods=['GET'])
def get_upcoming_events():
    try:
        limit = request.args.get('limit', 50, type=int)
        events = EventService.get_upcoming_events(limit)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get personalized feed
@event_bp.route('/feed/<user_netid>', methods=['GET'])
def get_personalized_feed(user_netid):
    try:
        limit = request.args.get('limit', 20, type=int)
        events = EventService.get_personalized_feed(user_netid, limit)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Search events by tag
@event_bp.route('/search', methods=['GET'])
def search_events_by_tag():
    try:
        tag = request.args.get('tag')
        if not tag:
            return jsonify({'error': 'tag query param is required'}), 400
        events = EventService.search_events_by_tag(tag)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#get users events they RSVP
@event_bp.route('/user/<user_netid>/rsvps', methods=['GET'])
def get_user_rsvp_events(user_netid):
    try:
        events = EventService.get_user_rsvp_events(user_netid)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#get users event status
@event_bp.route('/<event_id>/status/<user_netid>', methods=['GET'])
def get_user_event_status(event_id, user_netid):
    try:
        status = EventService.get_user_event_status(user_netid, event_id)
        return jsonify({'status': status}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#Update event
@event_bp.route('/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        data = request.json
        event = EventService.update_event(event_id, **data)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        return jsonify(event), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#Delete event
@event_bp.route('/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        success = EventService.delete_event(event_id)
        if not success:
            return jsonify({'error': 'Failed to delete event'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#RSVP'ing for an event
@event_bp.route('/<event_id>/rsvp', methods=['POST'])
def rsvp_event(event_id):
    try:
        data = request.json
        if not data.get('user_netid'):
            return jsonify({'error': 'user_netid is required'}), 400
        
        interaction = EventService.rsvp_event(data['user_netid'], event_id)
        return jsonify(interaction), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#User might go to an event
@event_bp.route('/<event_id>/maybe', methods=['POST'])
def maybe_event(event_id):
    try:
        data = request.json
        if not data.get('user_netid'):
            return jsonify({'error': 'user_netid is required'}), 400
        
        interaction = EventService.maybe_event(data['user_netid'], event_id)
        return jsonify(interaction), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#User declines an event
@event_bp.route('/<event_id>/decline', methods=['POST'])
def decline_event(event_id):
    try:
        data = request.json
        if not data.get('user_netid'):
            return jsonify({'error': 'user_netid is required'}), 400
        
        interaction = EventService.decline_event(data['user_netid'], event_id)
        return jsonify(interaction), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#User canceling event
@event_bp.route('/<event_id>/rsvp', methods=['DELETE'])
def cancel_rsvp(event_id):
    try:
        data = request.json
        if not data.get('user_netid'):
            return jsonify({'error': 'user_netid is required'}), 400
        
        success = EventService.cancel_rsvp(data['user_netid'], event_id)
        if not success:
            return jsonify({'error': 'Failed to cancel RSVP'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500