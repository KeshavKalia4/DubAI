'use client';

import { useLocalStorage } from './useLocalStorage'
import { UserProfile } from '@/types';

export function useUserProfile() {
    const [profile, setProfile, isLoaded] = useLocalStorage<UserProfile | null>(
        'dubai-user-profile',
        null
    );

    const clearProfile = () => {
        setProfile(null);
    };

    return { profile, setProfile, clearProfile, isLoaded };
}