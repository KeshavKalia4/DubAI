from flask import Blueprint, request, jsonify
from services.tag_service import TagService

tag_bp = Blueprint('tags', __name__)


#Update tag confidence (used internally, but exposed for flexibility)
@tag_bp.route('/user/<user_netid>/confidence', methods=['POST'])
def update_tag_confidence(user_netid):
    try:
        data = request.json
        if not data.get('tag_name') or not data.get('source'):
            return jsonify({'error': 'tag_name and source are required'}), 400
        
        tag = TagService.update_tag_confidence(
            user_netid=user_netid,
            tag_name=data['tag_name'],
            source=data['source']
        )
        return jsonify(tag), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Manually add a tag
@tag_bp.route('/user/<user_netid>', methods=['POST'])
def add_tag_manual(user_netid):
    try:
        data = request.json
        if not data.get('tag_name'):
            return jsonify({'error': 'tag_name is required'}), 400
        
        tag = TagService.add_tag_manual(user_netid, data['tag_name'])
        return jsonify(tag), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Boost a tag's confidence
@tag_bp.route('/user/<user_netid>/boost', methods=['PUT'])
def boost_tag(user_netid):
    try:
        data = request.json
        if not data.get('tag_name'):
            return jsonify({'error': 'tag_name is required'}), 400
        
        tag = TagService.boost_tag(user_netid, data['tag_name'])
        if not tag:
            return jsonify({'error': 'Tag not found'}), 404
        return jsonify(tag), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get user's tags
@tag_bp.route('/user/<user_netid>', methods=['GET'])
def get_user_tags(user_netid):
    try:
        include_negative = request.args.get('include_negative', 'false').lower() == 'true'
        tags = TagService.get_user_tags(user_netid, include_negative)
        return jsonify(tags), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get tag suggestions for onboarding
@tag_bp.route('/suggestions', methods=['GET'])
def get_tag_suggestions():
    try:
        suggestions = TagService.get_tag_suggestions()
        return jsonify(suggestions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Get tag suggestions by category
@tag_bp.route('/suggestions/<category>', methods=['GET'])
def get_tags_by_category(category):
    try:
        tags = TagService.get_tags_by_category(category)
        return jsonify(tags), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Remove a tag from user
@tag_bp.route('/user/<user_netid>/<tag_name>', methods=['DELETE'])
def remove_tag(user_netid, tag_name):
    try:
        success = TagService.remove_tag(user_netid, tag_name)
        if not success:
            return jsonify({'error': 'Failed to remove tag'}), 500
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500