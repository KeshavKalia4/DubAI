from flask import Blueprint, request, jsonify
from services.chat_service import ChatService

chat_bp = Blueprint('chats', __name__)

# Create a new conversation
@chat_bp.route('/', methods=['POST'])
def create_conversation():
    try:
        data = request.json or {}
        if not data.get('user_netid') or not data.get('messages'):
            return jsonify({'error': 'user_netid and messages are required'}), 400
        
        chat = ChatService.create_conversation(
            user_netid=data['user_netid'],
            messages=data['messages'],
            detected_tags=data.get('detected_tags')
        )
        return jsonify(chat), 201
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Append new messages to existing conversation
@chat_bp.route('/<conversation_id>/messages', methods=['POST'])
def append_to_conversation(conversation_id):
    try:
        data = request.json or {}
        if not data.get('new_messages'):
            return jsonify({'error': 'new_messages is required'}), 400
        
        chat = ChatService.append_to_conversation(
            conversation_id=conversation_id,
            new_messages=data['new_messages'],
            detected_tags=data.get('detected_tags')
        )
        return jsonify(chat), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Get a conversation
@chat_bp.route('/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    try:
        conversation = ChatService.get_conversation(conversation_id)
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404
        return jsonify(conversation), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Get conversation messages
@chat_bp.route('/<conversation_id>/messages', methods=['GET'])
def get_conversation_messages(conversation_id):
    try:
        messages = ChatService.get_conversation_messages(conversation_id)
        if messages is None:
            return jsonify({'error': 'Conversation not found'}), 404
        return jsonify(messages), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Get user's conversations
@chat_bp.route('/user/<user_netid>', methods=['GET'])
def get_user_conversations(user_netid):
    try:
        conversations = ChatService.get_user_conversations(user_netid)
        return jsonify(conversations), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Get conversation context for LLM
@chat_bp.route('/user/<user_netid>/context', methods=['GET'])
def get_conversation_context(user_netid):
    try:
        context = ChatService.get_conversation_context(user_netid)
        if context == "":
            return jsonify({'error': 'No conversations found'}), 404
        return jsonify({'context': context}), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Delete a conversation
@chat_bp.route('/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    try:
        success = ChatService.delete_conversation(conversation_id)
        if not success:
            return jsonify({'error': 'Failed to delete conversation'}), 404
        return jsonify({'success': True}), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500

# Clear all user conversations
@chat_bp.route('/user/<user_netid>', methods=['DELETE'])
def clear_user_conversations(user_netid):
    try:
        success = ChatService.clear_user_conversations(user_netid)
        if not success:
            return jsonify({'error': 'Failed to clear conversations'}), 500
        return jsonify({'success': True}), 200
    except Exception:
        return jsonify({'error': 'Internal server error'}), 500