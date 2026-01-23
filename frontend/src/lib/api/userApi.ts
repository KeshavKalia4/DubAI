/**
 * User API Service
 *
 * Handles all user-related API calls including:
 * - User CRUD operations
 * - Onboarding flow
 * - User existence checks
 */

import { api } from './client';
import type { BackendUser, BackendUserExistsResponse } from '@/types';

export interface CreateUserRequest {
  netid: string;
  name: string;
  email: string;
  major?: string;
  year?: string;
}

export interface OnboardingRequest {
  major: string;
  year: string;
  selected_tags: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  major?: string;
  year?: string;
}

export const userApi = {
  /**
   * Create a new user
   */
  create: (data: CreateUserRequest) =>
    api.post<BackendUser>('/users/', data),

  /**
   * Get user by netid
   */
  get: (netid: string) =>
    api.get<BackendUser>(`/users/${netid}`),

  /**
   * Get user with their tags
   */
  getWithTags: (netid: string) =>
    api.get<BackendUser>(`/users/${netid}/tags`),

  /**
   * Check if user exists
   */
  exists: (netid: string) =>
    api.get<BackendUserExistsResponse>(`/users/${netid}/exists`),

  /**
   * Complete onboarding for a user
   */
  completeOnboarding: (netid: string, data: OnboardingRequest) =>
    api.post<BackendUser>(`/users/${netid}/onboarding`, data),

  /**
   * Update user information
   */
  update: (netid: string, data: UpdateUserRequest) =>
    api.put<BackendUser>(`/users/${netid}`, data),

  /**
   * Update user's last active timestamp
   */
  updateLastActive: (netid: string) =>
    api.put<BackendUser>(`/users/${netid}/last-active`),

  /**
   * Delete a user
   */
  delete: (netid: string) =>
    api.delete<BackendUser>(`/users/${netid}`),
};
