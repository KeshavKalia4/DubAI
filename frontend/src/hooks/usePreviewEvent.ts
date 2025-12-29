/**
 * usePreviewEvent Hook
 *
 * Custom hook for managing preview event state with sessionStorage.
 * Eliminates duplicate useEffect blocks and provides a clean interface for:
 * - Loading preview on mount
 * - Listening for cross-tab storage changes
 * - Updating/deleting preview events
 *
 * @example
 * const { previewEvent, setPreviewEvent, deletePreviewEvent, isLoaded } = usePreviewEvent();
 */

'use client';

import { useState, useEffect } from 'react';
import { ContentItem } from '@/types';
import {
  loadPreviewEvent,
  savePreviewEvent,
  deletePreviewEvent as deletePreviewFromStorage,
  onPreviewChange
} from '@/utils/previewStorage';

export function usePreviewEvent() {
  const [previewEvent, setPreviewEvent] = useState<ContentItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preview on mount
  useEffect(() => {
    const event = loadPreviewEvent();
    setPreviewEvent(event);
    setIsLoaded(true);
  }, []);

  // Listen for storage changes (cross-tab synchronization)
  useEffect(() => {
    const unsubscribe = onPreviewChange((event) => {
      setPreviewEvent(event);
    });
    return unsubscribe;
  }, []);

  /**
   * Updates or clears the preview event
   * @param event - New preview event or null to clear
   */
  const updatePreviewEvent = (event: ContentItem | null) => {
    if (event) {
      savePreviewEvent(event);
    } else {
      deletePreviewFromStorage();
    }
    setPreviewEvent(event);
  };

  return {
    previewEvent,
    setPreviewEvent: updatePreviewEvent,
    deletePreviewEvent: () => updatePreviewEvent(null),
    isLoaded
  };
}
