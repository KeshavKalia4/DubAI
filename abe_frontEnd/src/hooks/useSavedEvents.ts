import { useState, useEffect, useCallback } from 'react';

export function useSavedEvents() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('savedEvents');
    if (stored) setSavedIds(JSON.parse(stored));
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      localStorage.setItem('savedEvents', JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { isSaved, toggleSave, savedIds };
}
