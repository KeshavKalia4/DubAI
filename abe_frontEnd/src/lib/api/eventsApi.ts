import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { BackendEvent, mapEventsToContentItems, mapEventToContentItem } from './mappers';
import { ContentItem } from '@/types';

export const eventsApi = {
  // Get personalized feed for a user
  async getFeed(userNetid: string, limit = 20): Promise<ContentItem[]> {
    const events = await apiClient.get<BackendEvent[]>(
      `${API_ENDPOINTS.eventsFeed(userNetid)}?limit=${limit}`
    );
    return mapEventsToContentItems(events);
  },

  // Get upcoming events
  async getUpcoming(limit = 50): Promise<ContentItem[]> {
    const events = await apiClient.get<BackendEvent[]>(
      `${API_ENDPOINTS.eventsUpcoming}?limit=${limit}`
    );
    return mapEventsToContentItems(events);
  },

  // Get a single event by ID
  async getEvent(eventId: string): Promise<ContentItem | null> {
    try {
      const event = await apiClient.get<BackendEvent>(API_ENDPOINTS.eventById(eventId));
      return mapEventToContentItem(event);
    } catch (error) {
      console.error('Failed to get event:', error);
      return null;
    }
  },

  // Search events by tag
  async searchByTag(tag: string): Promise<ContentItem[]> {
    const events = await apiClient.get<BackendEvent[]>(
      `${API_ENDPOINTS.events}/search?tag=${encodeURIComponent(tag)}`
    );
    return mapEventsToContentItems(events);
  },

  // Get events by RSO
  async getByRso(rsoId: string): Promise<ContentItem[]> {
    const events = await apiClient.get<BackendEvent[]>(
      `${API_ENDPOINTS.events}/rso/${rsoId}`
    );
    return mapEventsToContentItems(events);
  },

  // Get user's RSVP'd events
  async getUserRsvpEvents(userNetid: string): Promise<ContentItem[]> {
    const events = await apiClient.get<BackendEvent[]>(
      API_ENDPOINTS.userRsvpEvents(userNetid)
    );
    return mapEventsToContentItems(events);
  },
};
