import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

interface UserTag {
  tag_name: string;
  confidence_score: number;
  source: string;
}

interface TagSuggestion {
  name: string;
  category: string;
}

export const tagsApi = {
  // Get user's tags
  async getUserTags(userNetid: string, includeNegative = false): Promise<string[]> {
    const tags = await apiClient.get<UserTag[]>(
      `${API_ENDPOINTS.userTags(userNetid)}?include_negative=${includeNegative}`
    );
    return tags.map(t => t.tag_name);
  },

  // Add a tag manually
  async addTag(userNetid: string, tagName: string): Promise<UserTag> {
    return apiClient.post<UserTag>(API_ENDPOINTS.userTags(userNetid), {
      tag_name: tagName,
    });
  },

  // Remove a tag
  async removeTag(userNetid: string, tagName: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.userTags(userNetid)}/${encodeURIComponent(tagName)}`);
  },

  // Boost a tag's confidence
  async boostTag(userNetid: string, tagName: string): Promise<UserTag> {
    return apiClient.put<UserTag>(`${API_ENDPOINTS.userTags(userNetid)}/boost`, {
      tag_name: tagName,
    });
  },

  // Get tag suggestions for onboarding
  async getSuggestions(): Promise<TagSuggestion[]> {
    return apiClient.get<TagSuggestion[]>(API_ENDPOINTS.tagSuggestions);
  },

  // Get tags by category
  async getByCategory(category: string): Promise<TagSuggestion[]> {
    return apiClient.get<TagSuggestion[]>(`${API_ENDPOINTS.tagSuggestions}/${category}`);
  },
};
