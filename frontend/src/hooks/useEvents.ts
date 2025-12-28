'use client';

/**
 * useEvents Hook
 * Manages event state, persistence, and CRUD operations.
 * Combines mock events with user-created custom events.
 */

import { useState, useEffect } from 'react';
import { ContentItem } from '../types';
import { uwEvents } from '../data/uwEvents';
import { storage } from '@/lib/storage';

const KEY = 'customEvents';

export function useEvents() {
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /** Load custom events from storage on mount */
  useEffect(() => {
    void (async () => {
      let customEvents: ContentItem[] = [];
      try {
        const saved = await storage.get<ContentItem[]>(KEY);
        customEvents = Array.isArray(saved) ? saved : [];
      } finally {
        setEvents([...uwEvents, ...customEvents]);
        setIsLoaded(true);
      }
    })();
  }, []);

  /**
   * Add a new custom event (optimistic update)
   * @param event - Event data without ID
   * @returns The created event with generated ID
   * @behavior Updates UI immediately, persists async, reverts on failure
   * @exception Logs error and reverts state if storage fails
   */
  const addEvent = (event: Omit<ContentItem, 'id'>) => {
    const newEvent: ContentItem = {
      ...event,
      id: `custom-${Date.now()}`,
    };

    const prevEvents = events;
    setEvents([...prevEvents, newEvent]);

    void (async () => {
      try {
        const saved = await storage.get<ContentItem[]>(KEY);
        const customEvents = Array.isArray(saved) ? saved : [];
        const updatedCustomEvents = [...customEvents, newEvent];
        await storage.set(KEY, updatedCustomEvents);
        setEvents([...uwEvents, ...updatedCustomEvents]);
      } catch (err) {
        console.error('Failed to save event:', err);
        setEvents(prevEvents);
      }
    })();

    return newEvent;
  };

  /**
   * Delete a custom event (optimistic update)
   * @param eventId - ID of the event to delete
   * @returns false if not a custom event, true otherwise
   * @behavior Updates UI immediately, persists async, reverts on failure
   * @exception Logs error and reverts state if storage fails
   */
  const deleteEvent = (eventId: string) => {
    if (!eventId.startsWith('custom-')) {
      return false;
    }

    const prevEvents = events;
    setEvents(prevEvents.filter(event => event.id !== eventId));

    void (async () => {
      try {
        const saved = await storage.get<ContentItem[]>(KEY);
        const customEvents = Array.isArray(saved) ? saved : [];
        const updatedCustomEvents = customEvents.filter(event => event.id !== eventId);
        await storage.set(KEY, updatedCustomEvents);
        setEvents([...uwEvents, ...updatedCustomEvents]);
      } catch (err) {
        console.error('Failed to delete event:', err);
        setEvents(prevEvents);
      }
    })();

    return true;
  };

  return { events, addEvent, deleteEvent, isLoaded };
}
