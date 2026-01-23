from config import supabase
from typing import List, Dict, Optional
import json

class ChatService:
    
    MAX_CONVERSATIONS = 3  # Keep only last 3 conversations per user
    
    # ============================================
    # CREATE
    # ============================================
    
    @staticmethod
    def create_conversation(user_netid: str, messages: List[Dict], detected_tags: List[str] = None) -> Dict:
        """
        Create a new conversation with messages stored as JSON in title field
        Auto-deletes oldest conversation if user has 3+ conversations
        
        messages format: [
            {'role': 'user', 'content': 'What engineering clubs...'},
            {'role': 'assistant', 'content': 'Here are some...'}
        ]
        """
        try:
            from services.tag_service import TagService
            
            # Check existing conversation count
            existing = supabase.table('conversations') \
                .select('id, created_at') \
                .eq('user_netid', user_netid) \
                .order('created_at', desc=False) \
                .execute()
            
            # If user has 3+ conversations, delete the oldest
            if len(existing.data) >= ChatService.MAX_CONVERSATIONS:
                oldest_id = existing.data[0]['id']
                supabase.table('conversations').delete().eq('id', oldest_id).execute()
            
            # Store conversation with messages as JSON in title
            conversation_data = {
                'messages': messages,
                'detected_tags': detected_tags or []
            }
            
            result = supabase.table('conversations').insert({
                'user_netid': user_netid,
                'title': json.dumps(conversation_data)
            }).execute()
            
            # Update user tags if tags were detected
            if detected_tags:
                for tag in detected_tags:
                    TagService.update_tag_confidence(user_netid, tag, 'chatbot_conversation')
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating conversation: {e}")
            raise
    
    @staticmethod
    def append_to_conversation(conversation_id: str, new_messages: List[Dict], detected_tags: List[str] = None) -> Dict:
        """
        Append new messages to an existing conversation
        """
        try:
            from services.tag_service import TagService
            
            # Get existing conversation
            conv = ChatService.get_conversation(conversation_id)
            if not conv:
                raise ValueError(f"Conversation {conversation_id} not found")
            
            # Parse existing data
            existing_data = json.loads(conv['title'])
            existing_messages = existing_data.get('messages', [])
            existing_tags = existing_data.get('detected_tags', [])
            
            # Append new messages
            existing_messages.extend(new_messages)
            
            # Merge detected tags
            if detected_tags:
                all_tags = list(set(existing_tags + detected_tags))
            else:
                all_tags = existing_tags
            
            # Update conversation
            updated_data = {
                'messages': existing_messages,
                'detected_tags': all_tags
            }
            
            result = supabase.table('conversations').update({
                'title': json.dumps(updated_data)
            }).eq('id', conversation_id).execute()
            
            # Update user tags
            if detected_tags:
                user_netid = conv['user_netid']
                for tag in detected_tags:
                    TagService.update_tag_confidence(user_netid, tag, 'chatbot_conversation')
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error appending to conversation: {e}")
            raise
    
    # ============================================
    # READ
    # ============================================
    
    @staticmethod
    def get_conversation(conversation_id: str) -> Optional[Dict]:
        """Get a conversation by ID"""
        try:
            result = supabase.table('conversations') \
                .select('*') \
                .eq('id', conversation_id) \
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None
    
    @staticmethod
    def get_conversation_messages(conversation_id: str) -> Optional[List[Dict]]:
        """Get messages from a conversation"""
        try:
            conv = ChatService.get_conversation(conversation_id)
            if not conv or not conv.get('title'):
                return None
            
            data = json.loads(conv['title'])
            return data.get('messages', [])
        except Exception as e:
            print(f"Error getting conversation messages: {e}")
            return None
    
    @staticmethod
    def get_user_conversations(user_netid: str) -> List[Dict]:
        """Get user's last 3 conversations (ordered newest first)"""
        try:
            result = supabase.table('conversations') \
                .select('*') \
                .eq('user_netid', user_netid) \
                .order('updated_at', desc=True) \
                .limit(ChatService.MAX_CONVERSATIONS) \
                .execute()
            
            # Parse messages for each conversation
            conversations = []
            for conv in result.data:
                try:
                    data = json.loads(conv['title'])
                    conv['messages'] = data.get('messages', [])
                    conv['detected_tags'] = data.get('detected_tags', [])
                    conversations.append(conv)
                except:
                    # Skip malformed conversations
                    continue
            
            return conversations
        except Exception as e:
            print(f"Error getting user conversations: {e}")
            return []
    
    @staticmethod
    def get_conversation_context(user_netid: str) -> str:
        """
        Get conversation history formatted for LLM context
        Returns last 3 conversations as a formatted string
        """
        try:
            conversations = ChatService.get_user_conversations(user_netid)
            
            if not conversations:
                return ""
            
            context_parts = []
            for i, conv in enumerate(conversations, 1):
                messages = conv.get('messages', [])
                if not messages:
                    continue
                
                context_parts.append(f"--- Past Conversation {i} ---")
                for msg in messages:
                    role = msg.get('role', 'unknown')
                    content = msg.get('content', '')
                    context_parts.append(f"{role.capitalize()}: {content}")
                context_parts.append("")
            
            return "\n".join(context_parts)
        except Exception as e:
            print(f"Error getting conversation context: {e}")
            return ""
    
    # ============================================
    # DELETE
    # ============================================
    
    @staticmethod
    def delete_conversation(conversation_id: str) -> bool:
        """Delete a conversation"""
        try:
            supabase.table('conversations').delete().eq('id', conversation_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting conversation: {e}")
            return False
    
    @staticmethod
    def clear_user_conversations(user_netid: str) -> bool:
        """Delete all conversations for a user"""
        try:
            supabase.table('conversations').delete().eq('user_netid', user_netid).execute()
            return True
        except Exception as e:
            print(f"Error clearing user conversations: {e}")
            return False