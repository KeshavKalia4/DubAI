/**
 * API Module Index
 *
 * Re-exports all API services and utilities for easy importing.
 *
 * Usage:
 *   import { userApi, eventsApi, ApiError } from '@/lib/api';
 */

// Core utilities
export { apiClient, api, ApiError } from './client';
export { API_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_HEADERS } from './config';

// API services
export { userApi } from './userApi';
export { eventsApi } from './eventsApi';
export { chatApi } from './chatApi';
export { followsApi } from './followsApi';
export { tagsApi } from './tagsApi';
export { contributorApi } from './contributorApi';

// Re-export types from API modules
export type { CreateUserRequest, OnboardingRequest, UpdateUserRequest } from './userApi';
export type { CreateEventRequest, UpdateEventRequest, RsvpRequest } from './eventsApi';
export type { CreateConversationRequest, AppendMessagesRequest, ConversationContextResponse } from './chatApi';
export type { UserFollowRequest, RsoFollowRequest, FollowRecord, RsoFollowRecord } from './followsApi';
export type { UpdateTagConfidenceRequest, AddTagRequest, BoostTagRequest } from './tagsApi';
export type { ContributorRequest, ContributorStatus, CreateRequestData, AdminActionData } from './contributorApi';
