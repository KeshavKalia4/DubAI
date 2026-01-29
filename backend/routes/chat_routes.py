from flask import Blueprint, request, jsonify
from services.chat_service import ChatService
from services.event_service import EventService
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

chat_bp = Blueprint('chats', __name__)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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


# AI Chat endpoint - generates response using events context
@chat_bp.route('/ai', methods=['POST'])
def ai_chat():
    """
    AI-powered chat endpoint that answers questions about campus events.
    Uses upcoming events as context for generating responses.
    """
    try:
        data = request.json or {}
        message = data.get('message')
        user_netid = data.get('user_netid')

        if not message:
            return jsonify({'error': 'message is required'}), 400

        # Fetch upcoming events for context
        events = EventService.get_upcoming_events(limit=20)

        # Format events as context
        if events:
            events_context = "\n\n".join([
                f"Event: {e.get('title', 'Untitled')}\n"
                f"Organization: {e.get('rsos', {}).get('name', 'Unknown') if e.get('rsos') else 'Unknown'}\n"
                f"Date/Time: {e.get('date_time', 'TBD')}\n"
                f"Location: {e.get('location', 'TBD')}\n"
                f"Description: {e.get('description', 'No description')}\n"
                f"Tags: {', '.join(e.get('tags', [])) if e.get('tags') else 'None'}"
                for e in events
            ])
        else:
            events_context = "No upcoming events found."

        # Get conversation history if user is logged in
        conversation_history = ""
        if user_netid:
            try:
                conversation_history = ChatService.get_conversation_context(user_netid)
            except:
                pass

        # Build the system prompt
        system_prompt = """You are a helpful campus events assistant for University of Washington students.
You help students discover events, clubs, and activities on campus based on their interests.

IMPORTANT GUARDRAILS:
- Keep responses SHORT and CONCISE (3-5 sentences maximum)
- Recommend at most 3 events per response
- For each event, mention ONLY: title, date, and a brief 1-sentence why it's relevant
- Do NOT include full event descriptions, detailed tags lists, or excessive details
- Format should be clean and scannable (use bullet points or short paragraphs)
- Be friendly and encouraging, but keep it brief

When recommending events, use this format:
- **Event Title** (Date) - One sentence explaining why it's relevant.

Always be encouraging about getting involved on campus!"""

        # Build messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"""Here are the upcoming campus events:

{events_context}

{f"Previous conversation context:{chr(10)}{conversation_history}" if conversation_history else ""}

Student's question: {message}"""}
        ]

        # Call OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=500,
            temperature=0.7,
            messages=messages
        )

        ai_response = response.choices[0].message.content

        # Save to conversation history if user is logged in
        if user_netid:
            try:
                ChatService.create_conversation(
                    user_netid=user_netid,
                    messages=[
                        {"role": "user", "content": message},
                        {"role": "assistant", "content": ai_response}
                    ]
                )
            except Exception as e:
                print(f"Failed to save conversation: {e}")

        return jsonify({
            'response': ai_response,
            'events_count': len(events) if events else 0
        }), 200

    except Exception as e:
        print(f"AI Chat error: {e}")
        return jsonify({'error': f'Failed to generate response: {str(e)}'}), 500