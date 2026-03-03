import { useState, useEffect, useCallback } from 'react';
import { ContentItem } from '@/types';
import { mockContent } from '@/data/mockData';
import { eventsApi } from '@/lib/api';

interface UseEventsOptions {
  userNetid?: string;
  useFeed?: boolean;
}

export function useEvents(options: UseEventsOptions = {}) {
  const { userNetid, useFeed = false } = options;

  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load events from backend or fallback to mock data
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let apiEvents: ContentItem[] = [];

      if (useFeed && userNetid) {
        // Get personalized feed
        apiEvents = await eventsApi.getFeed(userNetid);
      } else {
        // Get upcoming events
        apiEvents = await eventsApi.getUpcoming();
      }

      // Get custom events from localStorage
      const stored = localStorage.getItem('customEvents');
      const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];

      // Always use API events (even if empty) + custom events
      // Only fallback to mock on actual errors
      setEvents([...apiEvents, ...customEvents]);
    } catch (err) {
      console.error('Failed to load events from API:', err);
      setError('Failed to load events');

      // Fallback to mock data
      const stored = localStorage.getItem('customEvents');
      const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];
      setEvents([...mockContent, ...customEvents]);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [userNetid, useFeed]);

  // Load events on mount and when dependencies change
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Add custom event (localStorage only - no backend yet)
  const addEvent = useCallback((event: Omit<ContentItem, 'id'>) => {
    const newEvent: ContentItem = {
      ...event,
      id: `custom-${Date.now()}`,
    };

    const stored = localStorage.getItem('customEvents');
    const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];
    const updatedCustomEvents = [...customEvents, newEvent];
    localStorage.setItem('customEvents', JSON.stringify(updatedCustomEvents));

    setEvents(prev => [...prev, newEvent]);

    return newEvent;
  }, []);

  // Delete custom event (localStorage only)
  const deleteEvent = useCallback((eventId: string) => {
    if (!eventId.startsWith('custom-')) {
      return false;
    }

    const stored = localStorage.getItem('customEvents');
    const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];
    const updatedCustomEvents = customEvents.filter(event => event.id !== eventId);
    localStorage.setItem('customEvents', JSON.stringify(updatedCustomEvents));

    setEvents(prev => prev.filter(event => event.id !== eventId));

    return true;
  }, []);

  // Refresh events from API
  const refresh = useCallback(() => {
    return loadEvents();
  }, [loadEvents]);

  return {
    events,
    addEvent,
    deleteEvent,
    isLoaded,
    isLoading,
    error,
    refresh,
  };
}
