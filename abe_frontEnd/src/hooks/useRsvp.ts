import { useState, useRef, useCallback, useEffect } from 'react';
import { RsvpStatus } from '@/types';
import { rsvpApi } from '@/lib/api';

interface RsvpSummary {
  going: number;
  interested: number;
  notGoing: number;
}

interface UseRsvpOptions {
  userNetid?: string;
}

export function useRsvp(options: UseRsvpOptions = {}) {
  const { userNetid } = options;

  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});
  const [summaries, setSummaries] = useState<Record<string, RsvpSummary>>({});
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const getRsvpStatus = useCallback((contentId: string): RsvpStatus => {
    return rsvps[contentId] || null;
  }, [rsvps]);

  const getRsvpSummary = useCallback((
    contentId: string,
    fallbackCount?: number
  ): RsvpSummary => {
    const summary = summaries[contentId];
    if (summary) return summary;

    if (fallbackCount) {
      return { going: fallbackCount, interested: 0, notGoing: 0 };
    }

    return { going: 0, interested: 0, notGoing: 0 };
  }, [summaries]);

  // Fetch RSVP count for an event
  const fetchRsvpCount = useCallback(async (eventId: string) => {
    try {
      const count = await rsvpApi.getRsvpCount(eventId);
      setSummaries(prev => ({
        ...prev,
        [eventId]: { going: count, interested: 0, notGoing: 0 },
      }));
    } catch (error) {
      console.error('Failed to fetch RSVP count:', error);
    }
  }, []);

  // Fetch user's RSVP status for an event
  const fetchUserStatus = useCallback(async (eventId: string) => {
    if (!userNetid) return;

    try {
      const status = await rsvpApi.getStatus(eventId, userNetid);
      setRsvps(prev => ({ ...prev, [eventId]: status }));
    } catch (error) {
      console.error('Failed to fetch RSVP status:', error);
    }
  }, [userNetid]);

  // Set RSVP with optimistic update and API sync
  const setRsvp = useCallback(async (contentId: string, status: RsvpStatus) => {
    if (!userNetid) {
      // No user logged in - just update local state
      setRsvps(prev => ({ ...prev, [contentId]: status }));
      return;
    }

    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const previousStatus = rsvps[contentId] || null;

    // Optimistic update
    setRsvps(prev => ({ ...prev, [contentId]: status }));
    setIsSyncing(prev => ({ ...prev, [contentId]: true }));

    // Update summary optimistically
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

    try {
      if (status === null) {
        // Cancel RSVP
        await rsvpApi.cancelRsvp(contentId, userNetid);
      } else if (status === 'going') {
        await rsvpApi.rsvpGoing(contentId, userNetid);
      } else if (status === 'interested') {
        await rsvpApi.rsvpInterested(contentId, userNetid);
      } else if (status === 'not_going') {
        await rsvpApi.rsvpDecline(contentId, userNetid);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to save RSVP:', error);

      // Revert optimistic update on error
      setRsvps(prev => ({ ...prev, [contentId]: previousStatus }));

      // Revert summary
      setSummaries(prev => {
        const current = prev[contentId] || { going: 0, interested: 0, notGoing: 0 };
        const reverted = { ...current };

        // Revert new status count
        if (status === 'going') reverted.going = Math.max(0, reverted.going - 1);
        if (status === 'interested') reverted.interested = Math.max(0, reverted.interested - 1);
        if (status === 'not_going') reverted.notGoing = Math.max(0, reverted.notGoing - 1);

        // Restore previous status count
        if (previousStatus === 'going') reverted.going += 1;
        if (previousStatus === 'interested') reverted.interested += 1;
        if (previousStatus === 'not_going') reverted.notGoing += 1;

        return { ...prev, [contentId]: reverted };
      });
    } finally {
      setIsSyncing(prev => ({ ...prev, [contentId]: false }));
    }
  }, [userNetid, rsvps]);

  // Load initial RSVP statuses when user changes
  useEffect(() => {
    if (!userNetid) {
      setRsvps({});
    }
  }, [userNetid]);

  return {
    getRsvpStatus,
    setRsvp,
    getRsvpSummary,
    fetchRsvpCount,
    fetchUserStatus,
    isSyncing,
  };
}
