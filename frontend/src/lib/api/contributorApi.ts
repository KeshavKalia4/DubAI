/**
 * Contributor API Service
 *
 * Handles all contributor verification-related API calls including:
 * - Creating verification requests
 * - Fetching contributor status
 * - Admin approval/denial operations
 */

import { api } from './client';

export interface ContributorRequest {
  id: string;
  user_netid: string;
  rso_id?: string;
  rso_name: string;
  reason: string;
  proof?: string;
  status: 'pending' | 'approved' | 'denied';
  admin_notes?: string;
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface ContributorStatus {
  is_contributor: boolean;
  is_admin: boolean;
  pending_request: ContributorRequest | null;
  requests: ContributorRequest[];
}

export interface CreateRequestData {
  user_netid: string;
  rso_name: string;
  reason: string;
  proof?: string;
  rso_id?: string;
}

export interface AdminActionData {
  admin_netid: string;
  admin_notes?: string;
}

export const contributorApi = {
  /**
   * Create a new contributor verification request
   */
  createRequest: (data: CreateRequestData) =>
    api.post<ContributorRequest>('/contributors/request', data),

  /**
   * Get contributor status and pending requests for a user
   */
  getStatus: (userNetid: string) =>
    api.get<ContributorStatus>(`/contributors/user/${userNetid}/status`),

  /**
   * Get all contributor requests for a user
   */
  getUserRequests: (userNetid: string) =>
    api.get<ContributorRequest[]>(`/contributors/user/${userNetid}/requests`),

  /**
   * Get all pending contributor requests (admin only)
   */
  getPendingRequests: (limit = 50) =>
    api.get<ContributorRequest[]>(`/contributors/admin/pending?limit=${limit}`),

  /**
   * Get all contributor requests with optional status filter (admin only)
   */
  getAllRequests: (status?: string, limit = 100) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    return api.get<ContributorRequest[]>(`/contributors/admin/all?${params.toString()}`);
  },

  /**
   * Approve a contributor request (admin only)
   */
  approveRequest: (requestId: string, data: AdminActionData) =>
    api.post<ContributorRequest>(`/contributors/admin/${requestId}/approve`, data),

  /**
   * Deny a contributor request (admin only)
   */
  denyRequest: (requestId: string, data: AdminActionData) =>
    api.post<ContributorRequest>(`/contributors/admin/${requestId}/deny`, data),
};
