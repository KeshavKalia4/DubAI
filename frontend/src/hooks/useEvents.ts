'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentItem, BackendEvent } from '../types';
import { mockContent } from '../data/mockData';
import { eventsApi } from '@/lib/api';

/**
 * Transforms a backend event to the frontend ContentItem format
 */
function transformBackendEvent(backendEvent: BackendEvent): ContentItem {
  // Get RSO name from nested rsos object or rso_name field
  const rsoName = backendEvent.rsos?.name || backendEvent.rso_name;

  // Get RSVP count from rsvp_count or rsvp field (backend returns rsvp as string)
  const rsvpCount = backendEvent.rsvp_count ||
    (typeof backendEvent.rsvp === 'string' ? parseInt(backendEvent.rsvp, 10) : backendEvent.rsvp) || 0;

  return {
    id: backendEvent.id,
    organizationId: 'uw', // Default organization
    type: 'event',
    title: backendEvent.title,
    description: backendEvent.description,
    tags: backendEvent.tags || [],
    date: backendEvent.date_time,
    location: backendEvent.location,
    rsoName,
    attendees: {
      count: rsvpCount,
      friends: [], // Will be populated separately if needed
    },
  };
}

interface UseEventsOptions {
  userNetid?: string;
  limit?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  const { userNetid, limit = 20 } = options;
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch events from API or fall back to mock data
   */
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let backendEvents: BackendEvent[];

      // Always use upcoming events endpoint for testing
      backendEvents = await eventsApi.getUpcoming(limit);

      // TODO: Re-enable personalized feed after testing
      // if (userNetid) {
      //   backendEvents = await eventsApi.getFeed(userNetid, limit);
      // } else {
      //   backendEvents = await eventsApi.getUpcoming(limit);
      // }

      // Transform backend events to frontend format
      const transformedEvents = backendEvents.map(transformBackendEvent);

      // Load custom events from localStorage
      const stored = localStorage.getItem('customEvents');
      const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];

      // Combine API events with custom events
      setEvents([...transformedEvents, ...customEvents]);
    } catch (err) {
      console.error('Failed to fetch events from API, using mock data:', err);
      setError('Failed to load events from server');

      // Fallback to mock data
      const stored = localStorage.getItem('customEvents');
      const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];
      setEvents([...mockContent, ...customEvents]);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [userNetid, limit]);

  // Fetch events on mount and when userNetid changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Add a custom event (stored locally)
   */
  const addEvent = useCallback((event: Omit<ContentItem, 'id'>) => {
    const newEvent: ContentItem = {
      ...event,
      id: `custom-${Date.now()}`,
    };

    // Get current custom events
    const stored = localStorage.getItem('customEvents');
    const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];

    // Add new event
    const updatedCustomEvents = [...customEvents, newEvent];
    localStorage.setItem('customEvents', JSON.stringify(updatedCustomEvents));

    // Update state - preserve API events and add new custom event
    setEvents(prev => {
      const apiEvents = prev.filter(e => !e.id.startsWith('custom-'));
      return [...apiEvents, ...updatedCustomEvents];
    });

    return newEvent;
  }, []);

  /**
   * Delete a custom event
   */
  const deleteEvent = useCallback((eventId: string) => {
    // Only allow deleting custom events
    if (!eventId.startsWith('custom-')) {
      return false;
    }

    // Get current custom events
    const stored = localStorage.getItem('customEvents');
    const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];

    // Remove the event
    const updatedCustomEvents = customEvents.filter(event => event.id !== eventId);
    localStorage.setItem('customEvents', JSON.stringify(updatedCustomEvents));

    // Update state
    setEvents(prev => prev.filter(event => event.id !== eventId));

    return true;
  }, []);

  /**
   * Refresh events from the API
   */
  const refresh = useCallback(() => {
    return fetchEvents();
  }, [fetchEvents]);

  /**
   * Search events by tag
   */
  const searchByTag = useCallback(async (tag: string): Promise<ContentItem[]> => {
    try {
      const backendEvents = await eventsApi.searchByTag(tag);
      return backendEvents.map(transformBackendEvent);
    } catch (err) {
      console.error('Failed to search events:', err);
      // Fallback to filtering mock data
      return mockContent.filter(item => item.tags.includes(tag));
    }
  }, []);

  return {
    events,
    addEvent,
    deleteEvent,
    isLoaded,
    isLoading,
    error,
    refresh,
    searchByTag,
  };
}
