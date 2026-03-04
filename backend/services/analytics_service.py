from config import supabase
from typing import Dict, List, Optional
from collections import Counter


class AnalyticsService:

    @staticmethod
    def get_summary(rso_id: Optional[str] = None) -> Dict:
        """Get high-level summary stats for an RSO or globally"""
        try:
            # Total events
            events_q = supabase.table('events').select('id, tags, rsvp', count='exact')
            if rso_id:
                events_q = events_q.eq('rso_id', rso_id)
            events_result = events_q.execute()
            total_events = events_result.count or 0
            events_data = events_result.data or []

            # Total RSVPs
            total_rsvps = sum(int(e.get('rsvp') or 0) for e in events_data)

            # Events by tag
            tag_counter: Counter = Counter()
            for event in events_data:
                for tag in (event.get('tags') or []):
                    tag_counter[tag] += 1
            events_by_tag = [{'tag': tag, 'count': count} for tag, count in tag_counter.most_common(10)]

            # RSO-specific events with RSVP breakdown
            events_list = []
            for event in events_data[:10]:  # top 10
                events_list.append({
                    'id': event['id'],
                    'rsvps': int(event.get('rsvp') or 0),
                })

            return {
                'total_events': total_events,
                'total_rsvps': total_rsvps,
                'events_by_tag': events_by_tag,
                'top_events': events_list,
            }
        except Exception as e:
            print(f"Error getting analytics summary: {e}")
            return {
                'total_events': 0,
                'total_rsvps': 0,
                'events_by_tag': [],
                'top_events': [],
            }

    @staticmethod
    def get_rsvp_by_event(rso_id: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """Get RSVP counts per event"""
        try:
            q = supabase.table('events').select('id, title, rsvp').order('rsvp', desc=True).limit(limit)
            if rso_id:
                q = q.eq('rso_id', rso_id)
            result = q.execute()
            return [
                {'event': e['title'], 'rsvps': int(e.get('rsvp') or 0), 'attended': 0}
                for e in (result.data or [])
            ]
        except Exception as e:
            print(f"Error getting RSVP by event: {e}")
            return []

    @staticmethod
    def get_total_users() -> int:
        """Get total registered users"""
        try:
            result = supabase.table('users').select('netid', count='exact').execute()
            return result.count or 0
        except Exception as e:
            print(f"Error getting total users: {e}")
            return 0
