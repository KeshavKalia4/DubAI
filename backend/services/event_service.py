from config import supabase
from typing import List, Dict, Optional
from datetime import datetime

class EventService:
    
    # ============================================
    # CREATE
    # ============================================
    
    @staticmethod
    def create_event(
        rso_id: str,
        title: str,
        description: str,
        date_time: str,
        location: str,
        tags: List[str]
    ) -> Dict:
        """Create a new event"""
        try:
            result = supabase.table('events').insert({
                'rso_id': rso_id,
                'title': title,
                'description': description,
                'date_time': date_time,
                'location': location,
                'tags': tags,
                'rsvp': '0'  # Initialize RSVP count to 0
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating event: {e}")
            raise
    
    # ============================================
    # READ
    # ============================================
    
    @staticmethod
    def get_event(event_id: str) -> Optional[Dict]:
        """Get single event by ID"""
        try:
            result = supabase.table('events') \
                .select('*, rsos(name, is_verified)') \
                .eq('id', event_id) \
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting event: {e}")
            return None
    
    @staticmethod
    def get_upcoming_events(limit: int = 50) -> List[Dict]:
        """Get all upcoming events"""
        try:
            result = supabase.table('events') \
                .select('*, rsos(name, is_verified)') \
                .gte('date_time', datetime.utcnow().isoformat()) \
                .order('date_time') \
                .limit(limit) \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting upcoming events: {e}")
            return []
    
    @staticmethod
    def get_personalized_feed(user_netid: str, limit: int = 20) -> List[Dict]:
        """Get personalized event recommendations for user"""
        try:
            from services.tag_service import TagService
            
            # Get user's positive tags
            user_tags = TagService.get_user_tags(user_netid, include_negative=False)
            user_tag_names = [tag['tag_name'] for tag in user_tags]
            
            if not user_tag_names:
                # No tags, return upcoming events
                return EventService.get_upcoming_events(limit)
            
            # Get upcoming events
            all_events = EventService.get_upcoming_events(100)
            
            # Get user's declined events
            declined = supabase.table('user_event_interactions') \
                .select('event_id') \
                .eq('user_netid', user_netid) \
                .eq('status', 'declined') \
                .execute()
            
            declined_ids = [d['event_id'] for d in declined.data]
            
            # Calculate match scores
            scored_events = []
            for event in all_events:
                # Skip declined events
                if event['id'] in declined_ids:
                    continue
                
                # Calculate match score
                event_tags = event.get('tags', [])
                if not event_tags:
                    continue
                
                score = 0
                for tag_name in event_tags:
                    for user_tag in user_tags:
                        if user_tag['tag_name'] == tag_name:
                            score += user_tag['confidence']
                
                if score > 0:
                    event['match_score'] = min(100, score * 20)
                    scored_events.append(event)
            
            # Sort by match score
            scored_events.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            
            return scored_events[:limit]
        except Exception as e:
            print(f"Error getting personalized feed: {e}")
            return EventService.get_upcoming_events(limit)
    
    @staticmethod
    def search_events_by_tag(tag: str) -> List[Dict]:
        """Search events by tag"""
        try:
            result = supabase.table('events') \
                .select('*, rsos(name, is_verified)') \
                .contains('tags', [tag]) \
                .gte('date_time', datetime.utcnow().isoformat()) \
                .order('date_time') \
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error searching events by tag: {e}")
            return []
    
    @staticmethod
    def get_user_rsvp_events(user_netid: str) -> List[Dict]:
        """Get events user has RSVP'd to"""
        try:
            interactions = supabase.table('user_event_interactions') \
                .select('event_id, status') \
                .eq('user_netid', user_netid) \
                .in_('status', ['rsvp', 'maybe']) \
                .execute()
            
            if not interactions.data:
                return []
            
            event_ids = [i['event_id'] for i in interactions.data]
            
            events = supabase.table('events') \
                .select('*, rsos(name, is_verified)') \
                .in_('id', event_ids) \
                .gte('date_time', datetime.utcnow().isoformat()) \
                .order('date_time') \
                .execute()
            
            # Add status to each event
            for event in events.data:
                for interaction in interactions.data:
                    if interaction['event_id'] == event['id']:
                        event['user_status'] = interaction['status']
                        break
            
            return events.data
        except Exception as e:
            print(f"Error getting user RSVP events: {e}")
            return []
    
    # ============================================
    # UPDATE
    # ============================================
    
    @staticmethod
    def update_event(event_id: str, **kwargs) -> Optional[Dict]:
        """Update event details"""
        try:
            result = supabase.table('events').update(kwargs).eq('id', event_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error updating event: {e}")
            raise
    
    @staticmethod
    def update_rsvp_count(event_id: str) -> None:
        """Recalculate and update RSVP count for an event"""
        try:
            # Count RSVPs
            result = supabase.table('user_event_interactions') \
                .select('id', count='exact') \
                .eq('event_id', event_id) \
                .eq('status', 'rsvp') \
                .execute()
            
            count = result.count or 0
            
            # Update event
            supabase.table('events').update({
                'rsvp': str(count)
            }).eq('id', event_id).execute()
        except Exception as e:
            print(f"Error updating RSVP count: {e}")
    
    # ============================================
    # DELETE
    # ============================================
    
    @staticmethod
    def delete_event(event_id: str) -> bool:
        """Delete an event"""
        try:
            supabase.table('events').delete().eq('id', event_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting event: {e}")
            return False
    
    # ============================================
    # INTERACTIONS (RSVP, Maybe, Decline)
    # ============================================
    
    @staticmethod
    def rsvp_event(user_netid: str, event_id: str) -> Dict:
        """User RSVPs to an event"""
        try:
            from services.tag_service import TagService
            
            # Insert or update interaction
            result = supabase.table('user_event_interactions').upsert({
                'user_netid': user_netid,
                'event_id': event_id,
                'status': 'rsvp'
            }, on_conflict='user_netid,event_id').execute()
            
            # Update RSVP count
            EventService.update_rsvp_count(event_id)
            
            # Update user tags based on event tags
            event = EventService.get_event(event_id)
            if event and event.get('tags'):
                for tag in event['tags']:
                    TagService.update_tag_confidence(user_netid, tag, 'event_rsvp')
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error RSVPing to event: {e}")
            raise
    
    @staticmethod
    def maybe_event(user_netid: str, event_id: str) -> Dict:
        """User marks event as 'maybe'"""
        try:
            from services.tag_service import TagService
            
            result = supabase.table('user_event_interactions').upsert({
                'user_netid': user_netid,
                'event_id': event_id,
                'status': 'maybe'
            }, on_conflict='user_netid,event_id').execute()
            
            # Update tags with lower confidence
            event = EventService.get_event(event_id)
            if event and event.get('tags'):
                for tag in event['tags']:
                    TagService.update_tag_confidence(user_netid, tag, 'event_maybe')
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error marking event as maybe: {e}")
            raise
    
    @staticmethod
    def decline_event(user_netid: str, event_id: str) -> Dict:
        """User declines an event"""
        try:
            from services.tag_service import TagService
            
            result = supabase.table('user_event_interactions').upsert({
                'user_netid': user_netid,
                'event_id': event_id,
                'status': 'declined'
            }, on_conflict='user_netid,event_id').execute()
            
            # Decrease tag confidence (negative signal)
            event = EventService.get_event(event_id)
            if event and event.get('tags'):
                for tag in event['tags']:
                    TagService.update_tag_confidence(user_netid, tag, 'event_decline')
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error declining event: {e}")
            raise
    
    @staticmethod
    def cancel_rsvp(user_netid: str, event_id: str) -> bool:
        """User cancels their RSVP"""
        try:
            supabase.table('user_event_interactions') \
                .delete() \
                .eq('user_netid', user_netid) \
                .eq('event_id', event_id) \
                .execute()
            
            # Update RSVP count
            EventService.update_rsvp_count(event_id)
            
            return True
        except Exception as e:
            print(f"Error canceling RSVP: {e}")
            return False
    
    @staticmethod
    def get_user_event_status(user_netid: str, event_id: str) -> Optional[str]:
        """Get user's status for an event"""
        try:
            result = supabase.table('user_event_interactions') \
                .select('status') \
                .eq('user_netid', user_netid) \
                .eq('event_id', event_id) \
                .execute()
            
            return result.data[0]['status'] if result.data else None
        except Exception as e:
            print(f"Error getting user event status: {e}")
            return None