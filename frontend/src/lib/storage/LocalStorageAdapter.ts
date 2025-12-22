import { Storage } from './Storage';

/**
 * LocalStorage Implementation
 * 
 * Wraps browser localStorage with async interface.
 * This allows seamless swapping to API storage later.
 * 
 * WHY ASYNC?
 * - localStorage is synchronous, but APIs are not
 * - By using async now, we can swap to API without changing any calling code
 * - The hooks don't care if storage takes 0ms or 500ms
 */
export class LocalStorageAdapter implements Storage {

  /**
   * Retrieve and parse data from localStorage
   * @param key - The storage key to look up
   * @returns Parsed data of type T, or null if not found/corrupted
   */
  async get<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }
    
    return safeParse<T>(item);
  }

  /**
   * Serialize and store data in localStorage
   * @param key - The storage key
   * @param value - Any serializable value (objects, arrays, primitives)
   */
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Remove a single item from localStorage
   * @param key - The storage key to remove
   */
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  /**
   * Clear ALL data from localStorage
   * Use with caution - typically for logout/reset scenarios
   */
  async clear(): Promise<void> {
    localStorage.clear();
  }
}

/**
 * Safely parse JSON string to typed object
 * 
 * WHY THIS EXISTS:
 * - JSON.parse throws on invalid JSON (corrupted data, manual edits)
 * - We want graceful degradation, not crashes
 * - Returns null for any parse error, letting the app handle missing data
 * 
 * @param source - JSON string to parse
 * @returns Parsed object of type T, or null if parsing fails
 */
function safeParse<T>(source: string): T | null {
  try {
    return JSON.parse(source) as T;
  } catch {
    return null;
  }
}
