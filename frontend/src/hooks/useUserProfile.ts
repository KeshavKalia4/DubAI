'use client';

/**
 * useUserProfile Hook
 * Manages user profile state and persistence.
 */

import { useEffect, useState, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { UserProfile } from '@/types';

const KEY = 'dubai-user-profile';

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /** Load profile from storage on mount */
  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get<UserProfile>(KEY);
        setProfileState(saved);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  /**
   * Update profile (optimistic update)
   * @param next - New profile data, or null to clear
   * @returns void
   * @behavior Updates state immediately, persists async
   * @exception Logs error if storage fails, state remains updated
   */
  const setProfile = useCallback((next: UserProfile | null) => {
    setProfileState(next);

    void (async () => {
      try {
        if (next === null) {
          await storage.remove(KEY);
          return;
        }
        await storage.set(KEY, next);
      } catch (err) {
        console.error('Failed to persist user profile:', err);
      }
    })();
  }, []);

  /**
   * Clear the user profile
   * @returns void
   * @behavior Calls setProfile(null)
   */
  const clearProfile = useCallback(() => {
    setProfile(null);
  }, [setProfile]);

  return { profile, setProfile, clearProfile, isLoaded };
}
