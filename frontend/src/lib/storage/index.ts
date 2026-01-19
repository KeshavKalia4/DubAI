/**
 * Storage Instance
 * Single point of change for swapping storage backends.
 *
 * To swap to API: replace LocalStorageAdapter with ApiStorageAdapter
 */

import { LocalStorageAdapter } from './LocalStorageAdapter';

export const storage = new LocalStorageAdapter();

export type { Storage } from './Storage';
