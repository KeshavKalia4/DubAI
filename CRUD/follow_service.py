from config import supabase
from typing import List, Dict, Optional
from datetime import datetime

class FollowService:
    
    # ============================================
    # USER FOLLOWS
    # ============================================
    
    @staticmethod
    def follow_user(follower_netid: str, following_netid: str) -> Dict:
        """Follow another user"""
        try:
            if follower_netid == following_netid:
                raise ValueError("Cannot follow yourself")
            
            result = supabase.table('follows').insert({
                'follower_netid': follower_netid,
                'following_netid': following_netid
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error following user: {e}")
            raise
    
    @staticmethod
    def unfollow_user(follower_netid: str, following_netid: str) -> bool:
        """Unfollow a user"""
        try:
            supabase.table('follows') \
                .delete() \
                .eq('follower_netid', follower_netid) \
                .eq('following_netid', following_netid) \
                .execute()
            
            return True
        except Exception as e:
            print(f"Error unfollowing user: {e}")
            return False
    
    @staticmethod
    def get_followers(user_netid: str) -> List[Dict]:
        """Get list of users following this user"""
        try:
            result = supabase.table('follows') \
                .select('follower_netid, users!follows_follower_netid_fkey(netid, name, major, year)') \
                .eq('following_netid', user_netid) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting followers: {e}")
            return []
    
    @staticmethod
    def get_following(user_netid: str) -> List[Dict]:
        """Get list of users this user is following"""
        try:
            result = supabase.table('follows') \
                .select('following_netid, users!follows_following_netid_fkey(netid, name, major, year)') \
                .eq('follower_netid', user_netid) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting following: {e}")
            return []
    
    @staticmethod
    def is_following(follower_netid: str, following_netid: str) -> bool:
        """Check if user is following another user"""
        try:
            result = supabase.table('follows') \
                .select('id') \
                .eq('follower_netid', follower_netid) \
                .eq('following_netid', following_netid) \
                .execute()
            
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking follow status: {e}")
            return False
    
    @staticmethod
    def get_follower_count(user_netid: str) -> int:
        """Get number of followers"""
        try:
            result = supabase.table('follows') \
                .select('id', count='exact') \
                .eq('following_netid', user_netid) \
                .execute()
            
            return result.count or 0
        except Exception as e:
            print(f"Error getting follower count: {e}")
            return 0
    
    @staticmethod
    def get_following_count(user_netid: str) -> int:
        """Get number of users being followed"""
        try:
            result = supabase.table('follows') \
                .select('id', count='exact') \
                .eq('follower_netid', user_netid) \
                .execute()
            
            return result.count or 0
        except Exception as e:
            print(f"Error getting following count: {e}")
            return 0
    
    # ============================================
    # RSO FOLLOWS
    # ============================================
    
    @staticmethod
    def follow_rso(user_netid: str, rso_id: str) -> Dict:
        """Follow an RSO"""
        try:
            result = supabase.table('rso_follows').insert({
                'user_netid': user_netid,
                'rso_id': rso_id
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error following RSO: {e}")
            raise
    
    @staticmethod
    def unfollow_rso(user_netid: str, rso_id: str) -> bool:
        """Unfollow an RSO"""
        try:
            supabase.table('rso_follows') \
                .delete() \
                .eq('user_netid', user_netid) \
                .eq('rso_id', rso_id) \
                .execute()
            
            return True
        except Exception as e:
            print(f"Error unfollowing RSO: {e}")
            return False
    
    @staticmethod
    def get_followed_rsos(user_netid: str) -> List[Dict]:
        """Get list of RSOs user is following"""
        try:
            result = supabase.table('rso_follows') \
                .select('rso_id, rsos(id, name, description, is_verified)') \
                .eq('user_netid', user_netid) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting followed RSOs: {e}")
            return []
    
    @staticmethod
    def get_rso_followers(rso_id: str) -> List[Dict]:
        """Get list of users following this RSO"""
        try:
            result = supabase.table('rso_follows') \
                .select('user_netid, users(netid, name, major, year)') \
                .eq('rso_id', rso_id) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting RSO followers: {e}")
            return []
    
    @staticmethod
    def is_following_rso(user_netid: str, rso_id: str) -> bool:
        """Check if user is following an RSO"""
        try:
            result = supabase.table('rso_follows') \
                .select('id') \
                .eq('user_netid', user_netid) \
                .eq('rso_id', rso_id) \
                .execute()
            
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking RSO follow status: {e}")
            return False
    
    @staticmethod
    def get_rso_follower_count(rso_id: str) -> int:
        """Get number of followers for an RSO"""
        try:
            result = supabase.table('rso_follows') \
                .select('id', count='exact') \
                .eq('rso_id', rso_id) \
                .execute()
            
            return result.count or 0
        except Exception as e:
            print(f"Error getting RSO follower count: {e}")
            return 0
    
    # ============================================
    # SOCIAL FEATURES FOR EVENTS
    # ============================================
    
    @staticmethod
    def get_friends_going_to_event(user_netid: str, event_id: str) -> List[Dict]:
        """Get list of friends (people you follow) who RSVP'd to an event"""
        try:
            # Get users you're following
            following_result = supabase.table('follows') \
                .select('following_netid') \
                .eq('follower_netid', user_netid) \
                .execute()
            
            following_netids = [f['following_netid'] for f in following_result.data]
            
            if not following_netids:
                return []
            
            # Get which friends RSVP'd to this event
            result = supabase.table('user_event_interactions') \
                .select('user_netid, users(netid, name, major, year)') \
                .in_('user_netid', following_netids) \
                .eq('event_id', event_id) \
                .eq('status', 'rsvp') \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting friends going to event: {e}")
            return []
    
    @staticmethod
    def get_event_rsvp_count(event_id: str) -> int:
        """Get total number of people who RSVP'd to event"""
        try:
            result = supabase.table('user_event_interactions') \
                .select('id', count='exact') \
                .eq('event_id', event_id) \
                .eq('status', 'rsvp') \
                .execute()
            
            return result.count or 0
        except Exception as e:
            print(f"Error getting RSVP count: {e}")
            return 0
    
    @staticmethod
    def get_following_events(user_netid: str, limit: int = 20) -> List[Dict]:
        """Get events from RSOs the user is following"""
        try:
            # Get followed RSO IDs
            followed_rsos = FollowService.get_followed_rsos(user_netid)
            rso_ids = [rso['rso_id'] for rso in followed_rsos]
            
            if not rso_ids:
                return []
            
            # Get events from those RSOs
            result = supabase.table('events') \
                .select('*, rsos(name, is_verified)') \
                .in_('rso_id', rso_ids) \
                .gte('date_time', datetime.utcnow().isoformat()) \
                .order('date_time') \
                .limit(limit) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting following events: {e}")
            return []