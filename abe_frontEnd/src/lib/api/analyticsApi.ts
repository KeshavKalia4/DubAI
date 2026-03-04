import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface AnalyticsSummary {
  total_events: number;
  total_rsvps: number;
  events_by_tag: { tag: string; count: number }[];
  top_events: { id: string; rsvps: number }[];
}

export interface RsvpByEvent {
  event: string;
  rsvps: number;
  attended: number;
}

export const analyticsApi = {
  async getSummary(rsoId?: string): Promise<AnalyticsSummary> {
    const url = rsoId
      ? `${API_ENDPOINTS.analyticsSummary}?rso_id=${encodeURIComponent(rsoId)}`
      : API_ENDPOINTS.analyticsSummary;
    return apiClient.get<AnalyticsSummary>(url);
  },

  async getRsvpByEvent(rsoId?: string, limit = 10): Promise<RsvpByEvent[]> {
    let url = `${API_ENDPOINTS.analyticsRsvpByEvent}?limit=${limit}`;
    if (rsoId) url += `&rso_id=${encodeURIComponent(rsoId)}`;
    return apiClient.get<RsvpByEvent[]>(url);
  },

  async getTotalUsers(): Promise<number> {
    const { total } = await apiClient.get<{ total: number }>(API_ENDPOINTS.analyticsUsersTotal);
    return total;
  },
};
