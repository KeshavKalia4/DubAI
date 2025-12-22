/**
 * Storage Instance
 * 
 * THE SINGLE POINT OF CHANGE
 * 
 * To swap to API backend, change ONE line:
 *   FROM: export const storage = new LocalStorageAdapter();
 *   TO:   export const storage = new ApiStorageAdapter('https://api.dubai.app');
 */

import { LocalStorageAdapter } from './LocalStorageAdapter';

// THE ONE LINE:
export const storage = new LocalStorageAdapter();

// Re-export the interface for type usage
export type { Storage } from './Storage';
