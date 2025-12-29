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
import { loadPreviewEvent, deletePreviewEvent } from '@/utils/previewStorage';

const KEY = 'customEvents';

export function useEvents() {
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /** Load custom events from storage and preview event from sessionStorage on mount */
  useEffect(() => {
    void (async () => {
      let customEvents: ContentItem[] = [];
      try {
        const saved = await storage.get<ContentItem[]>(KEY);
        customEvents = Array.isArray(saved) ? saved : [];
      } finally {
        // Load preview event from sessionStorage
        const previewEvent = loadPreviewEvent();

        // Combine all events: mock + custom + preview (if exists)
        const allEvents = [
          ...uwEvents,
          ...customEvents,
          ...(previewEvent ? [previewEvent] : [])
        ];

        setEvents(allEvents);
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

        // Preserve preview event from sessionStorage
        const previewEvent = loadPreviewEvent();
        setEvents([...uwEvents, ...updatedCustomEvents, ...(previewEvent ? [previewEvent] : [])]);
      } catch (err) {
        console.error('Failed to save event:', err);
        setEvents(prevEvents);
      }
    })();

    return newEvent;
  };

  /**
   * Delete a custom or preview event (optimistic update)
   * @param eventId - ID of the event to delete
   * @returns false if not a custom/preview event, true otherwise
   * @behavior Updates UI immediately, persists async, reverts on failure
   * @exception Logs error and reverts state if storage fails
   */
  const deleteEvent = (eventId: string) => {
    // Handle preview events - just clear sessionStorage
    if (eventId.startsWith('preview-')) {
      deletePreviewEvent();
      setEvents(events.filter(event => event.id !== eventId));
      return true;
    }

    // Handle custom events - persist to localStorage
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

        // Preserve preview event from sessionStorage
        const previewEvent = loadPreviewEvent();
        setEvents([...uwEvents, ...updatedCustomEvents, ...(previewEvent ? [previewEvent] : [])]);
      } catch (err) {
        console.error('Failed to delete event:', err);
        setEvents(prevEvents);
      }
    })();

    return true;
  };

  /**
   * Convert a preview event to a permanent custom event
   * @param previewId - ID of the preview event to finalize
   * @returns The new custom event, or null if preview not found
   * @behavior Converts preview to custom event, clears sessionStorage, updates UI
   * @exception Logs error and returns null if operation fails
   */
  const finalizePreview = (previewId: string): ContentItem | null => {
    // Get preview from sessionStorage
    const previewEvent = loadPreviewEvent();
    if (!previewEvent || previewEvent.id !== previewId) return null;

    try {
      // Create permanent event (reuse addEvent logic)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...eventData } = previewEvent;
      const newEvent = addEvent(eventData);

      // Clear preview from sessionStorage
      deletePreviewEvent();

      // Update UI state to remove preview (addEvent already added the new permanent one)
      setEvents(events.filter(e => e.id !== previewId));

      return newEvent;
    } catch (err) {
      console.error('Failed to finalize preview:', err);
      return null;
    }
  };

  return { events, addEvent, deleteEvent, finalizePreview, isLoaded };
}
