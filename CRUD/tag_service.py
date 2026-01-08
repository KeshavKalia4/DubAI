from config import supabase
from typing import List, Dict, Optional

class TagService:
    
    # Tag confidence deltas
    CONFIDENCE_DELTAS = {
        'onboarding': 0.8,
        'manual': 0.8,
        'event_rsvp': 0.15,
        'event_maybe': 0.05,
        'event_decline': -0.10,
        'chatbot_conversation': 0.6,
    }
    
    # ============================================
    # CREATE / UPDATE
    # ============================================
    
    @staticmethod
    def update_tag_confidence(user_netid: str, tag_name: str, source: str) -> Dict:
        """Update or create a user tag with confidence adjustment"""
        try:
            delta = TagService.CONFIDENCE_DELTAS.get(source, 0.0)
            
            # Check if tag exists
            existing = supabase.table('user_tags') \
                .select('*') \
                .eq('user_netid', user_netid) \
                .eq('tag_name', tag_name) \
                .execute()
            
            if existing.data:
                # Update existing tag
                current_confidence = existing.data[0]['confidence']
                new_confidence = max(0.0, min(1.0, current_confidence + delta))
                is_negative = new_confidence < 0.2
                
                result = supabase.table('user_tags').update({
                    'confidence': new_confidence,
                    'source': source,
                    'is_negative': is_negative
                }).eq('id', existing.data[0]['id']).execute()
                
                return result.data[0]
            else:
                # Create new tag
                confidence = max(0.0, min(1.0, delta if delta > 0 else 0.6))
                
                result = supabase.table('user_tags').insert({
                    'user_netid': user_netid,
                    'tag_name': tag_name,
                    'confidence': confidence,
                    'source': source,
                    'is_negative': False
                }).execute()
                
                return result.data[0]
        except Exception as e:
            print(f"Error updating tag confidence: {e}")
            raise
    
    @staticmethod
    def add_tag_manual(user_netid: str, tag_name: str) -> Dict:
        """User manually adds a tag"""
        return TagService.update_tag_confidence(user_netid, tag_name, 'manual')
    
    @staticmethod
    def boost_tag(user_netid: str, tag_name: str) -> Dict:
        """User manually boosts a tag confidence"""
        try:
            result = supabase.table('user_tags') \
                .update({'confidence': 0.9, 'source': 'manual'}) \
                .eq('user_netid', user_netid) \
                .eq('tag_name', tag_name) \
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error boosting tag: {e}")
            raise
    
    # ============================================
    # READ
    # ============================================
    
    @staticmethod
    def get_user_tags(user_netid: str, include_negative: bool = False) -> List[Dict]:
        """Get all tags for a user"""
        try:
            query = supabase.table('user_tags') \
                .select('*') \
                .eq('user_netid', user_netid) \
                .order('confidence', desc=True)
            
            if not include_negative:
                query = query.eq('is_negative', False)
            
            result = query.execute()
            return result.data
        except Exception as e:
            print(f"Error getting user tags: {e}")
            return []
    
    @staticmethod
    def get_tag_suggestions() -> List[Dict]:
        """Get suggested tags for onboarding"""
        try:
            result = supabase.table('tag_suggestions') \
                .select('*') \
                .order('display_order') \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting tag suggestions: {e}")
            return []
    
    @staticmethod
    def get_tags_by_category(category: str) -> List[Dict]:
        """Get tag suggestions by category"""
        try:
            result = supabase.table('tag_suggestions') \
                .select('*') \
                .eq('category', category) \
                .order('display_order') \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting tags by category: {e}")
            return []
    
    # ============================================
    # DELETE
    # ============================================
    
    @staticmethod
    def remove_tag(user_netid: str, tag_name: str) -> bool:
        """Remove a tag from user's profile"""
        try:
            supabase.table('user_tags') \
                .delete() \
                .eq('user_netid', user_netid) \
                .eq('tag_name', tag_name) \
                .execute()
            
            return True
        except Exception as e:
            print(f"Error removing tag: {e}")
            return False