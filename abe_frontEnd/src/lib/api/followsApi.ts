import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

interface RsoFollow {
  id: string;
  user_netid: string;
  rso_id: string;
}

interface Rso {
  id: string;
  name: string;
  logo_url?: string;
}

export const followsApi = {
  // Follow an RSO
  async followRso(userNetid: string, rsoId: string): Promise<RsoFollow> {
    return apiClient.post<RsoFollow>(API_ENDPOINTS.followRsos, {
      user_netid: userNetid,
      rso_id: rsoId,
    });
  },

  // Unfollow an RSO
  async unfollowRso(userNetid: string, rsoId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.followRsos, {
      user_netid: userNetid,
      rso_id: rsoId,
    });
  },

  // Get RSOs the user is following
  async getFollowedRsos(userNetid: string): Promise<Rso[]> {
    return apiClient.get<Rso[]>(API_ENDPOINTS.userFollowedRsos(userNetid));
  },

  // Check if user is following an RSO
  async isFollowingRso(userNetid: string, rsoId: string): Promise<boolean> {
    const response = await apiClient.get<{ is_following: boolean }>(
      API_ENDPOINTS.isFollowingRso(userNetid, rsoId)
    );
    return response.is_following;
  },
};
