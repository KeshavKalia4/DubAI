import { useState, useEffect, useCallback } from 'react';
import { eventsApi } from '@/lib/api';
import { useUserProfile } from './useUserProfile';

export function useSavedEvents() {
  const { profile } = useUserProfile();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved IDs from backend when user is available
  useEffect(() => {
    if (!profile?.id) {
      setIsLoaded(true);
      return;
    }

    eventsApi.getSavedEventIds(profile.id)
      .then(ids => setSavedIds(ids))
      .catch(() => {
        // Fallback to localStorage on error
        const stored = localStorage.getItem('savedEvents');
        if (stored) setSavedIds(JSON.parse(stored));
      })
      .finally(() => setIsLoaded(true));
  }, [profile?.id]);

  const toggleSave = useCallback(async (id: string) => {
    const alreadySaved = savedIds.includes(id);

    // Optimistic update
    setSavedIds(prev => alreadySaved ? prev.filter(s => s !== id) : [...prev, id]);

    if (!profile?.id) {
      // No user - save to localStorage only
      setSavedIds(prev => {
        localStorage.setItem('savedEvents', JSON.stringify(prev));
        return prev;
      });
      return;
    }

    try {
      if (alreadySaved) {
        await eventsApi.unsaveEvent(id, profile.id);
      } else {
        await eventsApi.saveEvent(id, profile.id);
      }
    } catch {
      // Rollback on error
      setSavedIds(prev => alreadySaved ? [...prev, id] : prev.filter(s => s !== id));
    }
  }, [savedIds, profile?.id]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { isSaved, toggleSave, savedIds, isLoaded };
}
