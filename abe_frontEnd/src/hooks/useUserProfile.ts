import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '@/types';
import { userApi } from '@/lib/api';

export function useUserProfile() {
  const [profile, setProfileLocal, isLoaded] = useLocalStorage<UserProfile | null>(
    'huskyhub-user-profile',
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync profile from backend when we have a profile ID
  const syncFromBackend = useCallback(async (netid: string) => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      const backendProfile = await userApi.getUserWithTags(netid);
      if (backendProfile) {
        setProfileLocal(backendProfile);
      }
    } catch (error) {
      console.error('Failed to sync profile from backend:', error);
      setSyncError('Failed to sync profile');
    } finally {
      setIsSyncing(false);
    }
  }, [setProfileLocal]);

  // Create or update profile in backend
  const setProfile = useCallback(async (newProfile: UserProfile | null) => {
    // Always update localStorage immediately (optimistic update)
    setProfileLocal(newProfile);

    if (!newProfile) return;

    try {
      setIsSyncing(true);
      setSyncError(null);

      // Check if user exists in backend
      const { exists } = await userApi.checkUserExists(newProfile.id);

      if (!exists) {
        // Create new user in backend
        await userApi.createUser(newProfile);
      } else {
        // Update existing user
        await userApi.updateUser(newProfile.id, newProfile);
      }
    } catch (error) {
      console.error('Failed to sync profile to backend:', error);
      setSyncError('Failed to save profile');
      // Profile is still saved locally
    } finally {
      setIsSyncing(false);
    }
  }, [setProfileLocal]);

  // Complete onboarding
  const completeOnboarding = useCallback(async (
    major: string,
    year: string,
    selectedTags: string[]
  ) => {
    if (!profile) return;

    try {
      setIsSyncing(true);
      setSyncError(null);

      const updatedProfile = await userApi.completeOnboarding(profile.id, {
        major,
        year,
        selected_tags: selectedTags,
      });

      setProfileLocal(updatedProfile);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setSyncError('Failed to complete onboarding');

      // Update locally anyway
      setProfileLocal({
        ...profile,
        major,
        year,
        tags: selectedTags,
      });
    } finally {
      setIsSyncing(false);
    }
  }, [profile, setProfileLocal]);

  const clearProfile = useCallback(() => {
    setProfileLocal(null);
    setSyncError(null);
  }, [setProfileLocal]);

  // Update last active on mount if profile exists
  useEffect(() => {
    if (isLoaded && profile?.id) {
      userApi.updateLastActive(profile.id).catch(() => {
        // Silently fail - not critical
      });
    }
  }, [isLoaded, profile?.id]);

  return {
    profile,
    setProfile,
    clearProfile,
    isLoaded,
    isSyncing,
    syncError,
    completeOnboarding,
    syncFromBackend,
  };
}
