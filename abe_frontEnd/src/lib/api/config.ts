// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
export const API_ENDPOINTS = {
  // Users
  users: '/api/users',
  userOnboarding: (netid: string) => `/api/users/${netid}/onboarding`,
  userExists: (netid: string) => `/api/users/${netid}/exists`,
  userWithTags: (netid: string) => `/api/users/${netid}/tags`,

  // Events
  events: '/api/events',
  eventsFeed: (userNetid: string) => `/api/events/feed/${userNetid}`,
  eventsUpcoming: '/api/events/upcoming',
  eventById: (eventId: string) => `/api/events/${eventId}`,
  eventRsvp: (eventId: string) => `/api/events/${eventId}/rsvp`,
  eventMaybe: (eventId: string) => `/api/events/${eventId}/maybe`,
  eventDecline: (eventId: string) => `/api/events/${eventId}/decline`,
  eventStatus: (eventId: string, userNetid: string) => `/api/events/${eventId}/status/${userNetid}`,
  userRsvpEvents: (userNetid: string) => `/api/events/user/${userNetid}/rsvps`,

  // Chats
  chats: '/api/chats',
  chatAi: '/api/chats/ai',

  // Tags
  tags: '/api/tags',
  tagSuggestions: '/api/tags/suggestions',
  userTags: (userNetid: string) => `/api/tags/user/${userNetid}`,

  // Follows
  followRsos: '/api/follows/rsos',
  userFollowedRsos: (userNetid: string) => `/api/follows/users/${userNetid}/rsos`,
  isFollowingRso: (userNetid: string, rsoId: string) => `/api/follows/users/${userNetid}/is-following-rso/${rsoId}`,
  eventRsvpCount: (eventId: string) => `/api/follows/events/${eventId}/rsvp-count`,
  friendsGoingToEvent: (eventId: string, userNetid: string) => `/api/follows/events/${eventId}/friends/${userNetid}`,

  // Saved events
  saveEvent: (eventId: string) => `/api/events/${eventId}/save`,
  savedEvents: (userNetid: string) => `/api/events/saved/${userNetid}`,
  savedEventIds: (userNetid: string) => `/api/events/saved/${userNetid}/ids`,

  // Contributors
  contributorStatus: (netid: string) => `/api/contributors/user/${netid}/status`,
  contributorApply: '/api/contributors/request',

  // Analytics
  analyticsSummary: '/api/analytics/summary',
  analyticsRsvpByEvent: '/api/analytics/rsvp-by-event',
  analyticsUsersTotal: '/api/analytics/users/total',
};
