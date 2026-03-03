import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { BackendUser, mapUserToProfile } from './mappers';
import { UserProfile } from '@/types';

interface UserExistsResponse {
  exists: boolean;
  onboarding_completed: boolean;
}

interface OnboardingData {
  major: string;
  year: string;
  selected_tags: string[];
}

export const userApi = {
  // Check if user exists and onboarding status
  async checkUserExists(netid: string): Promise<UserExistsResponse> {
    return apiClient.get<UserExistsResponse>(API_ENDPOINTS.userExists(netid));
  },

  // Get user by netid
  async getUser(netid: string): Promise<UserProfile | null> {
    try {
      const user = await apiClient.get<BackendUser>(`${API_ENDPOINTS.users}/${netid}`);
      return mapUserToProfile(user);
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  // Get user with tags
  async getUserWithTags(netid: string): Promise<UserProfile | null> {
    try {
      const user = await apiClient.get<BackendUser>(API_ENDPOINTS.userWithTags(netid));
      return mapUserToProfile(user);
    } catch (error) {
      console.error('Failed to get user with tags:', error);
      return null;
    }
  },

  // Create a new user
  async createUser(profile: UserProfile): Promise<UserProfile> {
    const userData = {
      netid: profile.id,
      name: profile.name,
      email: profile.email,
      major: profile.major,
      year: profile.year,
    };
    const user = await apiClient.post<BackendUser>(API_ENDPOINTS.users, userData);
    return mapUserToProfile(user);
  },

  // Complete onboarding
  async completeOnboarding(netid: string, data: OnboardingData): Promise<UserProfile> {
    const user = await apiClient.post<BackendUser>(
      API_ENDPOINTS.userOnboarding(netid),
      data
    );
    return mapUserToProfile(user);
  },

  // Update user
  async updateUser(netid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const userData: Record<string, unknown> = {};
    if (updates.name) userData.name = updates.name;
    if (updates.major) userData.major = updates.major;
    if (updates.year) userData.year = updates.year;

    const user = await apiClient.put<BackendUser>(
      `${API_ENDPOINTS.users}/${netid}`,
      userData
    );
    return mapUserToProfile(user);
  },

  // Update last active timestamp
  async updateLastActive(netid: string): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.users}/${netid}/last-active`);
  },
};
