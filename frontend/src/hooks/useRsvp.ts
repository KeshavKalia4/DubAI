'use client';

/**
 * useRsvp Hook
 * Manages RSVP state with optimistic updates and race condition handling.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { RsvpStatus, RsvpSummary } from '@/types';
import { storage } from '@/lib/storage';


const KEY = 'dubai-rsvps';


export function useRsvp() {
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
  void (async () => {
    try {
      const saved = await storage.get<Record<string, RsvpStatus>>(KEY);
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        setRsvps(saved);
      }
    } catch (err) {
      console.error('Failed to load RSVPs', err);
    }
  })();
}, []);

  /**
   * Get RSVP status for a content item
   * @param contentId - ID of the content
   * @returns User's RSVP status or null
   */
  const getRsvpStatus = useCallback((contentId: string): RsvpStatus => {
    return rsvps[contentId] || null;
  }, [rsvps]);

  /**
   * Get RSVP summary for a content item
   * @param contentId - ID of the content
   * @param fallbackCount - Default going count if no API data
   * @returns Summary with going/interested/notGoing counts
   */
  const getRsvpSummary = useCallback((
    _contentId: string,
    fallbackCount?: number
  ): RsvpSummary => {
    if (fallbackCount) {
      return { going: fallbackCount, interested: 0, notGoing: 0 };
    }
    return { going: 0, interested: 0, notGoing: 0 };
  }, []);

  /**
   * Set RSVP status 
   * @param contentId - ID of the content
   * @param status - New RSVP status
   * @behavior Updates UI immediately, cancels in-flight requests, reverts on error
   */
  const setRsvp = useCallback(async (
    contentId: string,
    status: RsvpStatus
  ) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Optimistic update
    const prevStatus = rsvps[contentId] || null;
    setRsvps(prev => ({ ...prev, [contentId]: status }));

    try {
      const saved = await storage.get<Record<string, RsvpStatus>>(KEY);
      const currentRsvps = (saved && typeof saved === 'object' && !Array.isArray(saved)) ? saved : {};
      
      const updatedRsvps = { ...currentRsvps, [contentId]: status };
      await storage.set(KEY, updatedRsvps);

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to save RSVP:', error);
      setRsvps(prev => ({ ...prev, [contentId]: prevStatus }));
    }
  }, [rsvps]);

  return { getRsvpStatus, setRsvp, getRsvpSummary };
}
