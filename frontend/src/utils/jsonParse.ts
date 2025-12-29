/**
 * Safe JSON Parse Utility
 *
 * Provides type-safe JSON parsing with consistent error handling across the codebase.
 * Eliminates repetitive try-catch blocks and provides context for debugging.
 */

/**
 * Safely parse JSON with error handling
 * @param json - JSON string or null
 * @param context - Context for error logging (e.g., 'preview event')
 * @returns Parsed object or null if invalid
 *
 * @example
 * const event = safeJsonParse<ContentItem>(
 *   sessionStorage.getItem('previewEvent'),
 *   'preview event'
 * );
 */
export function safeJsonParse<T>(
  json: string | null,
  context: string = 'JSON'
): T | null {
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch (err) {
    console.error(`Failed to parse ${context}:`, err);
    return null;
  }
}
