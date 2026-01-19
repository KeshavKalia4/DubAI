/**
 * Preview Event Storage Utilities
 *
 * Centralizes all preview event sessionStorage operations to eliminate:
 * - Magic string 'previewEvent' scattered across files
 * - Duplicate JSON parse logic
 * - Inconsistent error handling
 *
 * Single source of truth for preview event lifecycle management.
 */

import { ContentItem } from '@/types';
import { safeJsonParse } from './jsonParse';

const PREVIEW_KEY = 'previewEvent' as const;

/**
 * Saves a preview event to sessionStorage
 * @throws {Error} if serialization fails
 */
export function savePreviewEvent(event: ContentItem): void {
  try {
    sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(event));
  } catch (err) {
    console.error('Failed to save preview event:', err);
    throw err;
  }
}

/**
 * Loads a preview event from sessionStorage
 * @returns The preview event or null if not found/invalid
 */
export function loadPreviewEvent(): ContentItem | null {
  const json = sessionStorage.getItem(PREVIEW_KEY);
  return safeJsonParse<ContentItem>(json, 'preview event');
}

/**
 * Deletes the preview event from sessionStorage
 */
export function deletePreviewEvent(): void {
  try {
    sessionStorage.removeItem(PREVIEW_KEY);
  } catch (err) {
    console.error('Failed to delete preview event:', err);
  }
}

/**
 * Listen for preview event changes across tabs/windows
 * @param callback - Function to call when preview changes
 * @returns Cleanup function to remove listener
 */
export function onPreviewChange(
  callback: (event: ContentItem | null) => void
): () => void {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === PREVIEW_KEY) {
      const newEvent = safeJsonParse<ContentItem>(event.newValue, 'preview event storage change');
      callback(newEvent);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}
