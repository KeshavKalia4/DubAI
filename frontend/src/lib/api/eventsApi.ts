/**
 * Events API Service
 *
 * Handles all event-related API calls including:
 * - Event CRUD operations
 * - Personalized feed
 * - RSVP management
 * - Event search
 */

import { api } from './client';
import type { BackendEvent, BackendEventInteraction, BackendEventStatus } from '@/types';

export interface CreateEventRequest {
  rso_id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  tags: string[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  date_time?: string;
  location?: string;
  tags?: string[];
}

export interface RsvpRequest {
  user_netid: string;
}

export const eventsApi = {
  /**
   * Create a new event
   */
  create: (data: CreateEventRequest) =>
    api.post<BackendEvent>('/events/', data),

  /**
   * Get event by ID
   */
  get: (eventId: string) =>
    api.get<BackendEvent>(`/events/${eventId}`),

  /**
   * Get upcoming events
   */
  getUpcoming: (limit = 50) =>
    api.get<BackendEvent[]>(`/events/upcoming?limit=${limit}`),

  /**
   * Get personalized feed for a user
   */
  getFeed: (userNetid: string, limit = 20) =>
    api.get<BackendEvent[]>(`/events/feed/${userNetid}?limit=${limit}`),

  /**
   * Search events by tag
   */
  searchByTag: (tag: string) =>
    api.get<BackendEvent[]>(`/events/search?tag=${encodeURIComponent(tag)}`),

  /**
   * Get user's RSVP'd events
   */
  getUserRsvps: (userNetid: string) =>
    api.get<BackendEvent[]>(`/events/user/${userNetid}/rsvps`),

  /**
   * Get user's status for a specific event
   */
  getUserEventStatus: (eventId: string, userNetid: string) =>
    api.get<BackendEventStatus>(`/events/${eventId}/status/${userNetid}`),

  /**
   * Update an event
   */
  update: (eventId: string, data: UpdateEventRequest) =>
    api.put<BackendEvent>(`/events/${eventId}`, data),

  /**
   * Delete an event
   */
  delete: (eventId: string) =>
    api.delete<{ success: boolean }>(`/events/${eventId}`),

  /**
   * RSVP to an event (going)
   */
  rsvp: (eventId: string, userNetid: string) =>
    api.post<BackendEventInteraction>(`/events/${eventId}/rsvp`, { user_netid: userNetid }),

  /**
   * Mark as maybe attending an event
   */
  maybe: (eventId: string, userNetid: string) =>
    api.post<BackendEventInteraction>(`/events/${eventId}/maybe`, { user_netid: userNetid }),

  /**
   * Decline an event
   */
  decline: (eventId: string, userNetid: string) =>
    api.post<BackendEventInteraction>(`/events/${eventId}/decline`, { user_netid: userNetid }),

  /**
   * Cancel RSVP for an event
   */
  cancelRsvp: (eventId: string, userNetid: string) =>
    api.delete<{ success: boolean }>(`/events/${eventId}/rsvp`, { user_netid: userNetid }),
};
