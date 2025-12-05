/**
 * useRsvp Hook - Manages RSVP state and API interactions
 *
 * Purpose: Encapsulates all RSVP logic (state, API calls, race condition handling)
 * Why: Separates business logic from UI (Single Responsibility Principle)
 * Where: Can be used in any component that needs RSVP functionality
 */

import { useState, useRef, useCallback } from 'react';
import { RsvpStatus } from '@/types';

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
 * Custom hook for managing RSVPs
 *
 * Architecture:
 * - State stored in-memory (could be upgraded to localStorage for persistence)
 * - Optimistic updates for instant UI feedback
 * - Abort controller to prevent race conditions
 * - Returns stable references (useCallback) to prevent unnecessary re-renders
 */
export function useRsvp() {
  /**
   * STATE 1: User's RSVP statuses
   * Map of contentId → RsvpStatus
   *
   * Why Map structure?
   * - Fast O(1) lookup by contentId
   * - Easy to update single item
   * - TypeScript-friendly
   *
   * Example: { "event-123": "going", "event-456": "interested" }
   */
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});

  /**
   * STATE 2: RSVP summaries (counts per event)
   * Map of contentId → RsvpSummary
   *
   * Why separate from rsvps?
   * - User's status vs. aggregate counts are different concerns
   * - Summaries come from API, user status is local
   *
   * Example: { "event-123": { going: 15, interested: 8, notGoing: 2 } }
   */
  const [summaries, setSummaries] = useState<Record<string, RsvpSummary>>({});

  /**
   * REF: AbortController for cancelling in-flight requests
   *
   * Why useRef instead of useState?
   * - Ref doesn't trigger re-renders when changed
   * - We just need to store the controller, not display it
   * - Persists across renders (unlike local variables)
   *
   * Why AbortController?
   * - Prevents race conditions (user clicks multiple times fast)
   * - Cancels outdated requests to save bandwidth
   * - Native browser API, no extra libraries
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Get RSVP status for a specific content item
   *
   * @param contentId - ID of event/club/announcement
   * @returns User's RSVP status or null if not RSVP'd
   *
   * Why function instead of direct state access?
   * - Abstraction: Components don't need to know internal structure
   * - Future-proof: We can change storage without breaking components
   */
  const getRsvpStatus = useCallback((contentId: string): RsvpStatus => {
    return rsvps[contentId] || null;
  }, [rsvps]);

  /**
   * Get RSVP summary for a specific content item
   *
   * @param contentId - ID of event/club/announcement
   * @param fallbackCount - Default count if no data (e.g., from ContentItem.attendees.count)
   * @returns Summary with going/interested/notGoing counts
   *
   * Why fallbackCount parameter?
   * - ContentItem already has attendees.count from backend
   * - Use that until we fetch real RSVP summary
   * - Prevents showing "0 attending" when we know there are attendees
   */
  const getRsvpSummary = useCallback((
    contentId: string,
    fallbackCount?: number
  ): RsvpSummary => {
    const summary = summaries[contentId];

    if (summary) {
      return summary;
    }

    // Fallback: distribute count evenly (rough estimate until real data loads)
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
   * Set/update user's RSVP status
   *
   * @param contentId - ID of event/club/announcement
   * @param status - New RSVP status (or null to remove)
   *
   * Architecture decisions:
   * 1. Optimistic update (update UI immediately)
   * 2. Cancel previous request if still in-flight
   * 3. Call API in background
   * 4. Revert on error
   *
   * Why useCallback?
   * - Returns same function reference across renders
   * - Prevents child components from re-rendering unnecessarily
   * - Required when passing functions to dependencies arrays
   */
  const setRsvp = useCallback(async (
    contentId: string,
    status: RsvpStatus
  ) => {
    // STEP 1: Cancel any in-flight request for this content
    // Why? Prevents race conditions if user changes mind quickly
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // STEP 2: Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // STEP 3: Optimistic update - change UI immediately
    // Why? Better UX - feels instant, no waiting for API
    const previousStatus = rsvps[contentId] || null;
    setRsvps(prev => ({
      ...prev,
      [contentId]: status,
    }));

    // STEP 4: Call API in background
    // Note: In real implementation, this would be actual API call
    // For now, this is a placeholder showing the pattern
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/rsvp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ contentId, status }),
      //   signal: controller.signal,  // ← Enables abort!
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // TODO: Update summary with real data from API
      // const data = await response.json();
      // setSummaries(prev => ({
      //   ...prev,
      //   [contentId]: data.summary,
      // }));

    } catch (error: any) {
      // Handle abort separately (not an error, just cancelled)
      if (error.name === 'AbortError') {
        console.log('RSVP request cancelled (user changed mind)');
        return;
      }

      // Real error - revert optimistic update
      console.error('Failed to save RSVP:', error);
      setRsvps(prev => ({
        ...prev,
        [contentId]: previousStatus,
      }));

      // TODO: Show error toast to user
      // toast.error('Failed to save RSVP. Please try again.');
    }
  }, [rsvps]);

  /**
   * Return API for components
   *
   * Why return object instead of array?
   * - Named exports are clearer: `const { setRsvp } = useRsvp()`
   * - vs array: `const [???, setRsvp] = useRsvp()` - what's the first item?
   * - Object is self-documenting
   */
  return {
    getRsvpStatus,
    setRsvp,
    getRsvpSummary,
  };
}
