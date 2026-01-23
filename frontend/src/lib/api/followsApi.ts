/**
 * Follows API Service
 *
 * Handles follow relationships between users and RSOs, including:
 * - User follows
 * - RSO follows
 * - Friend-based event data
 */

import { api } from './client';
import type { BackendUser, BackendEvent, BackendRso } from '@/types';

export interface UserFollowRequest {
  follower_netid: string;
  following_netid: string;
}

export interface RsoFollowRequest {
  user_netid: string;
  rso_id: string;
}

export interface FollowRecord {
  id: string;
  follower_netid: string;
  following_netid: string;
  created_at: string;
}

export interface RsoFollowRecord {
  id: string;
  user_netid: string;
  rso_id: string;
  created_at: string;
}

export const followsApi = {
  // ========== User Follows ==========

  /**
   * Follow a user
   */
  followUser: (data: UserFollowRequest) =>
    api.post<FollowRecord>('/follows/users', data),

  /**
   * Unfollow a user
   */
  unfollowUser: (data: UserFollowRequest) =>
    api.delete<{ success: boolean }>('/follows/users', data),

  /**
   * Get followers of a user
   */
  getFollowers: (userNetid: string) =>
    api.get<BackendUser[]>(`/follows/users/${userNetid}/followers`),

  /**
   * Get users that a user is following
   */
  getFollowing: (userNetid: string) =>
    api.get<BackendUser[]>(`/follows/users/${userNetid}/following`),

  /**
   * Check if one user is following another
   */
  isFollowing: (followerNetid: string, followingNetid: string) =>
    api.get<{ is_following: boolean }>(`/follows/users/${followerNetid}/is-following/${followingNetid}`),

  /**
   * Get follower count for a user
   */
  getFollowerCount: (userNetid: string) =>
    api.get<{ count: number }>(`/follows/users/${userNetid}/followers/count`),

  /**
   * Get following count for a user
   */
  getFollowingCount: (userNetid: string) =>
    api.get<{ count: number }>(`/follows/users/${userNetid}/following/count`),

  // ========== RSO Follows ==========

  /**
   * Follow an RSO
   */
  followRso: (data: RsoFollowRequest) =>
    api.post<RsoFollowRecord>('/follows/rsos', data),

  /**
   * Unfollow an RSO
   */
  unfollowRso: (data: RsoFollowRequest) =>
    api.delete<{ success: boolean }>('/follows/rsos', data),

  /**
   * Get RSOs a user is following
   */
  getFollowedRsos: (userNetid: string) =>
    api.get<BackendRso[]>(`/follows/users/${userNetid}/rsos`),

  /**
   * Get followers of an RSO
   */
  getRsoFollowers: (rsoId: string) =>
    api.get<BackendUser[]>(`/follows/rsos/${rsoId}/followers`),

  /**
   * Check if user is following an RSO
   */
  isFollowingRso: (userNetid: string, rsoId: string) =>
    api.get<{ is_following: boolean }>(`/follows/users/${userNetid}/is-following-rso/${rsoId}`),

  /**
   * Get follower count for an RSO
   */
  getRsoFollowerCount: (rsoId: string) =>
    api.get<{ count: number }>(`/follows/rsos/${rsoId}/followers/count`),

  // ========== Event-related ==========

  /**
   * Get friends (users you follow) going to an event
   */
  getFriendsGoingToEvent: (eventId: string, userNetid: string) =>
    api.get<BackendUser[]>(`/follows/events/${eventId}/friends/${userNetid}`),

  /**
   * Get RSVP count for an event
   */
  getEventRsvpCount: (eventId: string) =>
    api.get<{ count: number }>(`/follows/events/${eventId}/rsvp-count`),

  /**
   * Get events from RSOs user is following
   */
  getFollowingEvents: (userNetid: string, limit = 20) =>
    api.get<BackendEvent[]>(`/follows/users/${userNetid}/following-events?limit=${limit}`),
};
