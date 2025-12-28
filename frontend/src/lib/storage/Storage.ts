/**
 * Storage Interface
 * Abstraction layer for data persistence.
 * Swap implementations without changing consuming code.
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
   * @returns Resolves when storage is complete
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Remove a single item by key
   * @param key - Unique identifier of data to remove
   * @returns Resolves when removal is complete
   */
  remove(key: string): Promise<void>;

  /**
   * Clear all stored data
   * @returns Resolves when clear is complete
   * @throws May throw if storage is unavailable
   */
  clear(): Promise<void>;
}
