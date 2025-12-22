/**
 * Storage Interface
 * 
 * Abstraction layer for data persistence. All storage implementations
 * must follow this contract.
 * 
 * 
 * @example
 * // Usage in hooks:
 * const user = await storage.get<UserProfile>('user');
 * await storage.set('user', updatedUser);
 */
export interface Storage {
  /**
   * Retrieve data by key
   * @param key - Unique identifier for the stored data
   * @returns The stored value cast to type T, or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store data with a key
   * @param key - Unique identifier for the data
   * @param value - Data to store (will be serialized)
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Remove a single item by key
   * @param key - Unique identifier of data to remove
   */
  remove(key: string): Promise<void>;

  /**
   * Clear ALL stored data - use with caution!
   * Typically used for logout or resetting app state
   */
  clear(): Promise<void>;
}
