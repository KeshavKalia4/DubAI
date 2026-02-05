from config import supabase
from typing import Optional, List, Dict


class UserService:
    
    # ============================================
    # CREATE
    # ============================================
    
    @staticmethod
    def create_user(netid: str, name: str, email: str, major: str = None, year: str = None) -> Dict:
        """Create a new user or return existing one if duplicate"""
        try:
            # Try to insert new user
            result = supabase.table('users').insert({
                'netid': netid,
                'name': name,
                'email': email,
                'major': major,
                'year': year,
                'onboarding_completed': False
            }).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            # If duplicate key error, return existing user
            if '23505' in str(e):  # PostgreSQL duplicate key error code
                existing = supabase.table('users').select('*').eq('netid', netid).execute()
                return existing.data[0] if existing.data else None
            print(f"Error creating user: {e}")
            raise
    
    @staticmethod
    def complete_onboarding(netid: str, major: str, year: str, selected_tags: List[str]) -> Dict:
        """Complete user onboarding with interests (also handles re-onboarding)"""
        try:
            # Update user profile
            supabase.table('users').update({
                'major': major,
                'year': year,
                'onboarding_completed': True
            }).eq('netid', netid).execute()

            # Delete ALL existing tags for user (allows changing preferences completely)
            supabase.table('user_tags').delete().eq('user_netid', netid).execute()

            # Insert new tags
            for tag in selected_tags:
                supabase.table('user_tags').insert({
                    'user_netid': netid,
                    'tag_name': tag,
                    'confidence': 0.8,
                    'source': 'onboarding',
                    'is_negative': False
                }).execute()

            # Return full user profile with decoded tags
            return UserService.get_user_with_tags(netid)
        except Exception as e:
            print(f"Error completing onboarding: {e}")
            raise
    
    # ============================================
    # READ
    # ============================================
    
    @staticmethod
    def get_user(netid: str) -> Optional[Dict]:
        """Get user by netid"""
        try:
            result = supabase.table('users').select('*').eq('netid', netid).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    @staticmethod
    def get_user_with_tags(netid: str) -> Optional[Dict]:
        """Get user profile with their tags"""
        try:
            # Get user
            user = supabase.table('users').select('*').eq('netid', netid).execute()

            if not user.data:
                return None

            # Get tags (excluding negative ones)
            tags = supabase.table('user_tags') \
                .select('*') \
                .eq('user_netid', netid) \
                .eq('is_negative', False) \
                .order('confidence', desc=True) \
                .execute()

            user_data = user.data[0]
            user_data['tags'] = tags.data

            return user_data
        except Exception as e:
            print(f"Error getting user with tags: {e}")
            return None
    
    @staticmethod
    def check_user_exists(netid: str) -> Dict:
        """Check if user exists and if onboarding is completed"""
        try:
            result = supabase.table('users').select('netid, onboarding_completed').eq('netid', netid).execute()
            if result.data:
                user = result.data[0]
                return {
                    'exists': True,
                    'onboarded': user.get('onboarding_completed', False)
                }
            return {'exists': False, 'onboarded': False}
        except Exception as e:
            print(f"Error checking user exists: {e}")
            return {'exists': False, 'onboarded': False}
    
    # ============================================
    # UPDATE
    # ============================================
    
    @staticmethod
    def update_user(netid: str, **kwargs) -> Optional[Dict]:
        """Update user profile"""
        try:
            result = supabase.table('users').update(kwargs).eq('netid', netid).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error updating user: {e}")
            raise
    
    @staticmethod
    def update_last_active(netid: str) -> None:
        """Update user's last active timestamp"""
        try:
            from datetime import datetime
            supabase.table('users').update({
                'last_active': datetime.utcnow().isoformat()
            }).eq('netid', netid).execute()
        except Exception as e:
            print(f"Error updating last active: {e}")
    
    # ============================================
    # DELETE
    # ============================================
    
    @staticmethod
    def delete_user(netid: str) -> bool:
        """Delete user (cascades to all related data)"""
        try:
            supabase.table('users').delete().eq('netid', netid).execute()
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False

    # ============================================
    # CONTRIBUTOR STATUS
    # ============================================

    @staticmethod
    def get_contributor_status(netid: str) -> Dict:
        """Get user's contributor status"""
        try:
            result = supabase.table('users').select('is_contributor').eq('netid', netid).execute()
            if result.data:
                user = result.data[0]
                return {
                    'is_contributor': user.get('is_contributor', False) or False,
                    'is_admin': False
                }
            return {'is_contributor': False, 'is_admin': False}
        except Exception as e:
            print(f"Error getting contributor status: {e}")
            return {'is_contributor': False, 'is_admin': False}

    @staticmethod
    def set_contributor_status(netid: str, is_contributor: bool) -> Optional[Dict]:
        """Update user's contributor status"""
        try:
            result = supabase.table('users').update({
                'is_contributor': is_contributor
            }).eq('netid', netid).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error setting contributor status: {e}")
            raise