import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { mapBackendRsvpStatus } from './mappers';
import { RsvpStatus } from '@/types';

interface RsvpResponse {
  id?: string;
  user_netid: string;
  event_id: string;
  status: string;
}

interface EventStatusResponse {
  status: string | null;
}

interface RsvpCountResponse {
  count: number;
}

interface FriendGoingResponse {
  netid: string;
  name: string;
}

export const rsvpApi = {
  // RSVP "going" to an event
  async rsvpGoing(eventId: string, userNetid: string): Promise<RsvpResponse> {
    return apiClient.post<RsvpResponse>(API_ENDPOINTS.eventRsvp(eventId), {
      user_netid: userNetid,
    });
  },

  // RSVP "interested/maybe" to an event
  async rsvpInterested(eventId: string, userNetid: string): Promise<RsvpResponse> {
    return apiClient.post<RsvpResponse>(API_ENDPOINTS.eventMaybe(eventId), {
      user_netid: userNetid,
    });
  },

  // Decline an event
  async rsvpDecline(eventId: string, userNetid: string): Promise<RsvpResponse> {
    return apiClient.post<RsvpResponse>(API_ENDPOINTS.eventDecline(eventId), {
      user_netid: userNetid,
    });
  },

  // Cancel RSVP
  async cancelRsvp(eventId: string, userNetid: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.eventRsvp(eventId), {
      user_netid: userNetid,
    });
  },

  // Get user's RSVP status for an event
  async getStatus(eventId: string, userNetid: string): Promise<RsvpStatus> {
    const response = await apiClient.get<EventStatusResponse>(
      API_ENDPOINTS.eventStatus(eventId, userNetid)
    );
    return mapBackendRsvpStatus(response.status);
  },

  // Get RSVP count for an event
  async getRsvpCount(eventId: string): Promise<number> {
    const response = await apiClient.get<RsvpCountResponse>(
      API_ENDPOINTS.eventRsvpCount(eventId)
    );
    return response.count;
  },

  // Get friends going to an event
  async getFriendsGoing(eventId: string, userNetid: string): Promise<string[]> {
    const friends = await apiClient.get<FriendGoingResponse[]>(
      API_ENDPOINTS.friendsGoingToEvent(eventId, userNetid)
    );
    return friends.map(f => f.name);
  },
};
