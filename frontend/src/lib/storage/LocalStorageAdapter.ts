import { Storage } from './Storage';

/**
 * LocalStorage Implementation
 *
 * Wraps browser localStorage with async interface.
 * localStorage is synchronous, but APIs are not - by using async now,
 * we can swap to API storage without changing any consuming code.
 */
export class LocalStorageAdapter implements Storage {
  /**
   * Retrieve and parse data from localStorage
   * @param key - The storage key to look up
   * @returns Parsed data of type T, or null if not found/corrupted
   */
  async get<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return safeParse<T>(item);
  }

  /**
   * Serialize and store data in localStorage
   * @param key - The storage key
   * @param value - Any serializable value
   * @returns Resolves when storage is complete
   * @throws QuotaExceededError if localStorage is full
   */
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Remove a single item from localStorage
   * @param key - The storage key to remove
   * @returns Resolves when removal is complete
   */
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  /**
   * Clear all data from localStorage
   * @returns Resolves when clear is complete
   */
  async clear(): Promise<void> {
    localStorage.clear();
  }
}

/**
 * Safely parse JSON string to typed object
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
