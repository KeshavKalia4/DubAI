import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { userApi } from './userApi';

export interface ContributorStatus {
  is_contributor: boolean;
  is_admin: boolean;
  pending_request: ContributorRequest | null;
  requests: ContributorRequest[];
}

export interface ContributorRequest {
  id: string;
  user_netid: string;
  rso_name: string;
  rso_id: string | null;
  reason: string;
  proof: string | null;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
}

export interface ContributorProfile {
  netid: string;
  name: string;
  email: string;
  rso_id: string | null;
  rso_name: string | null;
}

export interface ApplyPayload {
  user_netid: string;
  rso_name: string;
  position: string;
  reason: string;
}

const STORAGE_KEY = 'contributor-profile';

export const contributorApi = {
  async getStatus(netid: string): Promise<ContributorStatus> {
    return apiClient.get<ContributorStatus>(
      `/api/contributors/user/${netid}/status`
    );
  },

  async apply(payload: ApplyPayload): Promise<ContributorRequest> {
    return apiClient.post<ContributorRequest>('/api/contributors/request', {
      user_netid: payload.user_netid,
      rso_name: payload.rso_name,
      reason: `Position: ${payload.position}\n\n${payload.reason}`,
    });
  },

  // Local session helpers
  saveSession(profile: ContributorProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  },

  getSession(): ContributorProfile | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as ContributorProfile;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
