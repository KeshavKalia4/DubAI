from config import supabase
from typing import List, Dict, Optional

class RSOService:
    
    # ============================================
    # CREATE
    # ============================================
    
    @staticmethod
    def create_rso(name: str, description: str = None, is_verified: bool = False) -> Dict:
        """Create a new RSO"""
        try:
            result = supabase.table('rsos').insert({
                'name': name,
                'description': description,
                'is_verified': is_verified
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating RSO: {e}")
            raise
    
    # ============================================
    # READ
    # ============================================
    
    @staticmethod
    def get_rso(rso_id: str) -> Optional[Dict]:
        """Get RSO by ID"""
        try:
            result = supabase.table('rsos').select('*').eq('id', rso_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting RSO: {e}")
            return None
    
    @staticmethod
    def get_rso_by_name(name: str) -> Optional[Dict]:
        """Get RSO by name"""
        try:
            result = supabase.table('rsos').select('*').eq('name', name).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting RSO by name: {e}")
            return None
    
    @staticmethod
    def get_all_rsos(verified_only: bool = False) -> List[Dict]:
        """Get all RSOs"""
        try:
            query = supabase.table('rsos').select('*').order('name')
            
            if verified_only:
                query = query.eq('is_verified', True)
            
            result = query.execute()
            return result.data
        except Exception as e:
            print(f"Error getting all RSOs: {e}")
            return []
    
    @staticmethod
    def search_rsos(search_term: str) -> List[Dict]:
        """Search RSOs by name"""
        try:
            result = supabase.table('rsos') \
                .select('*') \
                .ilike('name', f'%{search_term}%') \
                .order('name') \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error searching RSOs: {e}")
            return []
    
    @staticmethod
    def get_rso_events(rso_id: str, upcoming_only: bool = True) -> List[Dict]:
        """Get all events for an RSO"""
        try:
            from datetime import datetime
            
            query = supabase.table('events') \
                .select('*') \
                .eq('rso_id', rso_id) \
                .order('date_time')
            
            if upcoming_only:
                query = query.gte('date_time', datetime.utcnow().isoformat())
            
            result = query.execute()
            return result.data
        except Exception as e:
            print(f"Error getting RSO events: {e}")
            return []
    
    # ============================================
    # UPDATE
    # ============================================
    
    @staticmethod
    def update_rso(rso_id: str, **kwargs) -> Optional[Dict]:
        """Update RSO details"""
        try:
            result = supabase.table('rsos').update(kwargs).eq('id', rso_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error updating RSO: {e}")
            raise
    
    @staticmethod
    def verify_rso(rso_id: str) -> Optional[Dict]:
        """Mark RSO as verified"""
        return RSOService.update_rso(rso_id, is_verified=True)
    
    # ============================================
    # DELETE
    # ============================================
    
    @staticmethod
    def delete_rso(rso_id: str) -> bool:
        """Delete an RSO (cascades to events)"""
        try:
            supabase.table('rsos').delete().eq('id', rso_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting RSO: {e}")
            return False