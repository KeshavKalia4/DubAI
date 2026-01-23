'use client';

import { useEffect, useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile, BackendUser } from '@/types';
import { userApi, ApiError } from '@/lib/api';

/**
 * Transforms a backend user to the frontend UserProfile format
 */
function transformBackendUser(backendUser: BackendUser): UserProfile {
  return {
    id: backendUser.netid, // Use netid as the ID for consistency
    name: backendUser.name,
    email: backendUser.email,
    organizationId: 'uw', // Default organization
    major: backendUser.major || undefined,
    year: backendUser.year || undefined,
    tags: backendUser.tags?.map(t => t.tag_name) || [],
  };
}

export function useUserProfile() {
  const [profile, setProfileLocal, isLoaded] = useLocalStorage<UserProfile | null>(
    'dubai-user-profile',
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  /**
   * Check if user exists in backend and sync data
   */
  const syncWithBackend = useCallback(async (netid: string) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      // Check if user exists
      const existsResponse = await userApi.exists(netid);

      if (existsResponse.exists && existsResponse.onboarded) {
        // User exists and is onboarded, fetch full profile
        const backendUser = await userApi.getWithTags(netid);
        const frontendProfile = transformBackendUser(backendUser);
        setProfileLocal(frontendProfile);
        return frontendProfile;
      }

      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        setSyncError(error.message);
      } else {
        setSyncError('Failed to sync with server');
      }
      // Return cached profile on error
      return profile;
    } finally {
      setIsSyncing(false);
    }
  }, [profile, setProfileLocal]);

  /**
   * Set profile both locally and sync to backend
   */
  const setProfile = useCallback(async (newProfile: UserProfile | null) => {
    // Always update local storage immediately (optimistic update)
    setProfileLocal(newProfile);

    if (newProfile) {
      try {
        // Try to sync to backend
        const existsResponse = await userApi.exists(newProfile.id);

        if (!existsResponse.exists) {
          // Create new user
          await userApi.create({
            netid: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            major: newProfile.major,
            year: newProfile.year,
          });
        } else {
          // Update existing user
          await userApi.update(newProfile.id, {
            name: newProfile.name,
            major: newProfile.major,
            year: newProfile.year,
          });
        }

        // Update last active timestamp
        await userApi.updateLastActive(newProfile.id);
      } catch (error) {
        // Log error but don't revert - local storage is the source of truth for now
        console.error('Failed to sync profile to backend:', error);
      }
    }
  }, [setProfileLocal]);

  /**
   * Complete onboarding and sync to backend
   */
  const completeOnboarding = useCallback(async (
    netid: string,
    name: string,
    email: string,
    major: string,
    year: string,
    selectedTags: string[]
  ): Promise<UserProfile> => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      // Check if user exists
      const existsResponse = await userApi.exists(netid);

      if (!existsResponse.exists) {
        // Create new user first
        await userApi.create({
          netid,
          name,
          email,
          major,
          year,
        });
      }

      // Complete onboarding
      const backendUser = await userApi.completeOnboarding(netid, {
        major,
        year,
        selected_tags: selectedTags,
      });

      const frontendProfile = transformBackendUser(backendUser);
      setProfileLocal(frontendProfile);

      return frontendProfile;
    } catch (error) {
      // Fallback to local-only profile on error
      console.error('Backend onboarding failed, using local profile:', error);

      const localProfile: UserProfile = {
        id: netid,
        name,
        email,
        organizationId: 'uw',
        major,
        year,
        tags: selectedTags,
      };

      setProfileLocal(localProfile);
      setSyncError('Offline mode - changes will sync when connected');

      return localProfile;
    } finally {
      setIsSyncing(false);
    }
  }, [setProfileLocal]);

  const clearProfile = useCallback(() => {
    setProfileLocal(null);
  }, [setProfileLocal]);

  // On mount, try to sync with backend if we have a cached profile
  useEffect(() => {
    if (isLoaded && profile?.id) {
      syncWithBackend(profile.id);
    }
  }, [isLoaded]); // Only run once on mount when loaded

  return {
    profile,
    setProfile,
    clearProfile,
    isLoaded,
    isSyncing,
    syncError,
    completeOnboarding,
    syncWithBackend,
  };
}
