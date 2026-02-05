from config import supabase
from typing import Optional, List, Dict
from datetime import datetime
from services.user_service import UserService


class ContributorService:
    """Service for managing contributor verification requests"""

    # ============================================
    # CREATE
    # ============================================

    @staticmethod
    def create_request(
        user_netid: str,
        rso_name: str,
        reason: str,
        proof: Optional[str] = None,
        rso_id: Optional[str] = None
    ) -> Dict:
        """Create a new contributor verification request"""
        try:
            result = supabase.table('contributor_requests').insert({
                'user_netid': user_netid,
                'rso_name': rso_name,
                'reason': reason,
                'proof': proof,
                'rso_id': rso_id,
                'status': 'pending'
            }).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            # Check for unique constraint violation
            if '23505' in str(e):
                raise ValueError('You already have a request for this organization')
            print(f"Error creating contributor request: {e}")
            raise

    # ============================================
    # READ
    # ============================================

    @staticmethod
    def get_request(request_id: str) -> Optional[Dict]:
        """Get a contributor request by ID"""
        try:
            result = supabase.table('contributor_requests').select('*').eq('id', request_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting contributor request: {e}")
            return None

    @staticmethod
    def get_user_requests(user_netid: str) -> List[Dict]:
        """Get all contributor requests for a user"""
        try:
            result = supabase.table('contributor_requests') \
                .select('*') \
                .eq('user_netid', user_netid) \
                .order('created_at', desc=True) \
                .execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting user requests: {e}")
            return []

    @staticmethod
    def get_pending_requests(limit: int = 50) -> List[Dict]:
        """Get all pending contributor requests"""
        try:
            result = supabase.table('contributor_requests') \
                .select('*') \
                .eq('status', 'pending') \
                .order('created_at', desc=False) \
                .limit(limit) \
                .execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting pending requests: {e}")
            return []

    @staticmethod
    def get_all_requests(status: Optional[str] = None, limit: int = 100) -> List[Dict]:
        """Get all contributor requests, optionally filtered by status"""
        try:
            query = supabase.table('contributor_requests').select('*')
            if status:
                query = query.eq('status', status)
            result = query.order('created_at', desc=True).limit(limit).execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting all requests: {e}")
            return []

    # ============================================
    # UPDATE
    # ============================================

    @staticmethod
    def approve_request(
        request_id: str,
        admin_netid: str,
        admin_notes: Optional[str] = None
    ) -> Optional[Dict]:
        """Approve a contributor request and set user as contributor"""
        try:
            # Get the request first
            request = ContributorService.get_request(request_id)
            if not request:
                return None

            # Update the request status
            result = supabase.table('contributor_requests').update({
                'status': 'approved',
                'reviewed_by': admin_netid,
                'admin_notes': admin_notes,
                'reviewed_at': datetime.utcnow().isoformat()
            }).eq('id', request_id).execute()

            if result.data:
                # Set user as contributor
                UserService.set_contributor_status(request['user_netid'], True)

            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error approving request: {e}")
            raise

    @staticmethod
    def deny_request(
        request_id: str,
        admin_netid: str,
        admin_notes: Optional[str] = None
    ) -> Optional[Dict]:
        """Deny a contributor request"""
        try:
            result = supabase.table('contributor_requests').update({
                'status': 'denied',
                'reviewed_by': admin_netid,
                'admin_notes': admin_notes,
                'reviewed_at': datetime.utcnow().isoformat()
            }).eq('id', request_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error denying request: {e}")
            raise
