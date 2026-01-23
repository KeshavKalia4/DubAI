/**
 * Tags API Service
 *
 * Handles all tag-related API calls including:
 * - User tag management
 * - Tag suggestions for onboarding
 * - Tag confidence updates
 */

import { api } from './client';
import type { BackendUserTag, TagSuggestion } from '@/types';

export interface UpdateTagConfidenceRequest {
  tag_name: string;
  source: 'onboarding' | 'chat' | 'event_rsvp' | 'event_decline' | 'manual';
}

export interface AddTagRequest {
  tag_name: string;
}

export interface BoostTagRequest {
  tag_name: string;
}

export const tagsApi = {
  /**
   * Get tag suggestions for onboarding
   */
  getSuggestions: () =>
    api.get<TagSuggestion[]>('/tags/suggestions'),

  /**
   * Get tag suggestions by category
   */
  getSuggestionsByCategory: (category: string) =>
    api.get<TagSuggestion[]>(`/tags/suggestions/${category}`),

  /**
   * Get user's tags
   */
  getUserTags: (userNetid: string, includeNegative = false) =>
    api.get<BackendUserTag[]>(`/tags/user/${userNetid}?include_negative=${includeNegative}`),

  /**
   * Update tag confidence for a user
   */
  updateConfidence: (userNetid: string, data: UpdateTagConfidenceRequest) =>
    api.post<BackendUserTag>(`/tags/user/${userNetid}/confidence`, data),

  /**
   * Manually add a tag to a user
   */
  addTag: (userNetid: string, tagName: string) =>
    api.post<BackendUserTag>(`/tags/user/${userNetid}`, { tag_name: tagName }),

  /**
   * Boost a tag's confidence for a user
   */
  boostTag: (userNetid: string, tagName: string) =>
    api.put<BackendUserTag>(`/tags/user/${userNetid}/boost`, { tag_name: tagName }),

  /**
   * Remove a tag from a user
   */
  removeTag: (userNetid: string, tagName: string) =>
    api.delete<{ success: boolean }>(`/tags/user/${userNetid}/${encodeURIComponent(tagName)}`),
};
