'use client';

import { useState, useEffect } from 'react';
import { ContentItem } from '../types';
import { mockContent } from '../data/mockData';

export function useEvents() {
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load custom events from localStorage
    const stored = localStorage.getItem('customEvents');
    const customEvents: ContentItem[] = stored ? JSON.parse(stored) : [];

    // Combine mock data with custom events
    setEvents([...mockContent, ...customEvents]);
    setIsLoaded(true);
  }, []);

  const addEvent = (event: Omit<ContentItem, 'id'>) => {
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

    // Update state
    setEvents([...mockContent, ...updatedCustomEvents]);

    return newEvent;
  };

  const deleteEvent = (eventId: string) => {
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
    setEvents([...mockContent, ...updatedCustomEvents]);

    return true;
  };

  return { events, addEvent, deleteEvent, isLoaded };
}
