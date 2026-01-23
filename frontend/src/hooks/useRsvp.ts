/**
 * useRsvp Hook - Manages RSVP state and API interactions
 *
 * Purpose: Encapsulates all RSVP logic (state, API calls, race condition handling)
 * Why: Separates business logic from UI (Single Responsibility Principle)
 * Where: Can be used in any component that needs RSVP functionality
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { RsvpStatus } from '@/types';
import { eventsApi, followsApi, ApiError } from '@/lib/api';

/**
 * Type for RSVP summary data (returned from API)
 * Shows aggregate counts for an event
 */
interface RsvpSummary {
  going: number;
  interested: number;
  notGoing: number;
}

/**
 * Maps frontend RsvpStatus to backend interaction type
 */
function mapStatusToInteractionType(status: RsvpStatus): 'rsvp' | 'maybe' | 'declined' | null {
  switch (status) {
    case 'going':
      return 'rsvp';
    case 'interested':
      return 'maybe';
    case 'not_going':
      return 'declined';
    default:
      return null;
  }
}

/**
 * Maps backend interaction type to frontend RsvpStatus
 */
function mapInteractionTypeToStatus(type: 'rsvp' | 'maybe' | 'declined' | null): RsvpStatus {
  switch (type) {
    case 'rsvp':
      return 'going';
    case 'maybe':
      return 'interested';
    case 'declined':
      return 'not_going';
    default:
      return null;
  }
}

interface UseRsvpOptions {
  userNetid?: string;
}

/**
 * Custom hook for managing RSVPs with API integration
 */
export function useRsvp(options: UseRsvpOptions = {}) {
  const { userNetid } = options;

  /**
   * STATE 1: User's RSVP statuses
   * Map of contentId → RsvpStatus
   */
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});

  /**
   * STATE 2: RSVP summaries (counts per event)
   * Map of contentId → RsvpSummary
   */
  const [summaries, setSummaries] = useState<Record<string, RsvpSummary>>({});

  /**
   * STATE 3: Loading states per event
   */
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  /**
   * REF: AbortController for cancelling in-flight requests
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch user's RSVP status for an event from the API
   */
  const fetchEventStatus = useCallback(async (eventId: string) => {
    if (!userNetid) return;

    try {
      const response = await eventsApi.getUserEventStatus(eventId, userNetid);
      const status = mapInteractionTypeToStatus(response.status);
      setRsvps(prev => ({ ...prev, [eventId]: status }));
    } catch (error) {
      // Silently fail - use local state
      console.error('Failed to fetch event status:', error);
    }
  }, [userNetid]);

  /**
   * Fetch RSVP count for an event
   */
  const fetchEventRsvpCount = useCallback(async (eventId: string) => {
    try {
      const response = await followsApi.getEventRsvpCount(eventId);
      setSummaries(prev => ({
        ...prev,
        [eventId]: {
          going: response.count,
          interested: prev[eventId]?.interested || 0,
          notGoing: prev[eventId]?.notGoing || 0,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch RSVP count:', error);
    }
  }, []);

  /**
   * Get RSVP status for a specific content item
   */
  const getRsvpStatus = useCallback((contentId: string): RsvpStatus => {
    return rsvps[contentId] || null;
  }, [rsvps]);

  /**
   * Get RSVP summary for a specific content item
   */
  const getRsvpSummary = useCallback((
    contentId: string,
    fallbackCount?: number
  ): RsvpSummary => {
    const summary = summaries[contentId];

    if (summary) {
      return summary;
    }

    // Fallback: use provided count
    if (fallbackCount) {
      return {
        going: fallbackCount,
        interested: 0,
        notGoing: 0,
      };
    }

    // No data at all
    return {
      going: 0,
      interested: 0,
      notGoing: 0,
    };
  }, [summaries]);

  /**
   * Check if an RSVP operation is loading
   */
  const isRsvpLoading = useCallback((contentId: string): boolean => {
    return loading[contentId] || false;
  }, [loading]);

  /**
   * Set/update user's RSVP status with API sync
   */
  const setRsvp = useCallback(async (
    contentId: string,
    status: RsvpStatus
  ) => {
    // STEP 1: Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // STEP 2: Create new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // STEP 3: Optimistic update
    const previousStatus = rsvps[contentId] || null;
    setRsvps(prev => ({
      ...prev,
      [contentId]: status,
    }));

    // Update summary counts optimistically
    setSummaries(prev => {
      const current = prev[contentId] || { going: 0, interested: 0, notGoing: 0 };
      const updated = { ...current };

      // Decrement previous status count
      if (previousStatus === 'going') updated.going = Math.max(0, updated.going - 1);
      if (previousStatus === 'interested') updated.interested = Math.max(0, updated.interested - 1);
      if (previousStatus === 'not_going') updated.notGoing = Math.max(0, updated.notGoing - 1);

      // Increment new status count
      if (status === 'going') updated.going += 1;
      if (status === 'interested') updated.interested += 1;
      if (status === 'not_going') updated.notGoing += 1;

      return { ...prev, [contentId]: updated };
    });

    // STEP 4: Call API if user is logged in
    if (userNetid) {
      setLoading(prev => ({ ...prev, [contentId]: true }));

      try {
        if (status === null) {
          // Cancel RSVP
          await eventsApi.cancelRsvp(contentId, userNetid);
        } else if (status === 'going') {
          await eventsApi.rsvp(contentId, userNetid);
        } else if (status === 'interested') {
          await eventsApi.maybe(contentId, userNetid);
        } else if (status === 'not_going') {
          await eventsApi.decline(contentId, userNetid);
        }

        // Refresh the count from API after successful update
        await fetchEventRsvpCount(contentId);
      } catch (error) {
        // Handle abort separately
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('RSVP request cancelled');
          return;
        }

        // Revert optimistic update on error
        console.error('Failed to save RSVP:', error);
        setRsvps(prev => ({
          ...prev,
          [contentId]: previousStatus,
        }));

        // Revert summary counts
        setSummaries(prev => {
          const current = prev[contentId] || { going: 0, interested: 0, notGoing: 0 };
          const reverted = { ...current };

          // Undo the optimistic changes
          if (status === 'going') reverted.going = Math.max(0, reverted.going - 1);
          if (status === 'interested') reverted.interested = Math.max(0, reverted.interested - 1);
          if (status === 'not_going') reverted.notGoing = Math.max(0, reverted.notGoing - 1);

          if (previousStatus === 'going') reverted.going += 1;
          if (previousStatus === 'interested') reverted.interested += 1;
          if (previousStatus === 'not_going') reverted.notGoing += 1;

          return { ...prev, [contentId]: reverted };
        });

        // Re-throw for component error handling if needed
        if (error instanceof ApiError) {
          throw error;
        }
      } finally {
        setLoading(prev => ({ ...prev, [contentId]: false }));
      }
    }
  }, [rsvps, userNetid, fetchEventRsvpCount]);

  /**
   * Load initial RSVP status for an event
   */
  const loadEventRsvp = useCallback(async (eventId: string) => {
    await Promise.all([
      fetchEventStatus(eventId),
      fetchEventRsvpCount(eventId),
    ]);
  }, [fetchEventStatus, fetchEventRsvpCount]);

  return {
    getRsvpStatus,
    setRsvp,
    getRsvpSummary,
    isRsvpLoading,
    loadEventRsvp,
  };
}
