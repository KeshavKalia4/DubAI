export interface Organization {
  id: string;
  name: string;
  domains: string[];
  branding: {
    primaryColor: string;
    secondaryColor?: string;
    logoUrl?: string;
  };
  onboardingConfig: {
    majors: string[];
    campuses: string[];
    years: string[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  major?: string;
  year?: string;
  tags: string[]; // Interest tags
}

export type ContentType = 'event' | 'club' | 'announcement';

export interface ContentItem {
  id: string;
  organizationId: string;
  type: ContentType;
  title: string;
  description: string;
  tags: string[];
  date?: string; // ISO string for events
  location?: string;
  imageUrl?: string;
  rsoName?: string; // RSO/organization name from backend
  link?: string; // External link for the event

  // Enhanced Features
  coordinates?: { lat: number; lng: number };
  attendees?: { count: number; friends: string[] };
  images?: string[];
  stories?: { id: string; imageUrl: string; expiresAt: string }[];
  aiSummary?: string;
}

export interface Tag {
  id: string;
  label: string;
  category: 'topic' | 'identity' | 'career' | 'major';
}

export type RsvpStatus = 'going' | 'interested' | 'not_going' | null;

export interface RSVP {
  contentId: string;
  userId: string;
  status: RsvpStatus;
  timestamp?: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;  // ← Function with no params, no return
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;  // ← Optional action button
}

// ============================================
// Backend Response Types
// ============================================

/**
 * User response from backend user_service.py
 */
export interface BackendUser {
  id: string;
  netid: string;
  name: string;
  email: string;
  major?: string | null;
  year?: string | null;
  created_at: string;
  last_active?: string | null;
  onboarded: boolean;
  tags?: BackendUserTag[];
}

/**
 * Response from /users/{netid}/exists endpoint
 */
export interface BackendUserExistsResponse {
  exists: boolean;
  onboarded?: boolean;
}

/**
 * Event response from backend event_service.py
 */
export interface BackendEvent {
  id: string;
  rso_id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  tags: string[];
  image_path?: string | null;
  link?: string | null;
  created_at: string;
  updated_at?: string | null;
  rso_name?: string;
  rsvp_count?: number;
  rsvp?: number | string;
  maybe_count?: number;
  rsos?: {
    name: string;
    is_verified: boolean;
  };
}

/**
 * Event interaction record from backend
 */
export interface BackendEventInteraction {
  id: string;
  user_netid: string;
  event_id: string;
  interaction_type: 'rsvp' | 'maybe' | 'declined';
  created_at: string;
}

/**
 * User's status for a specific event
 */
export interface BackendEventStatus {
  status: 'rsvp' | 'maybe' | 'declined' | null;
}

/**
 * Conversation from backend chat_service.py
 */
export interface BackendConversation {
  id: string;
  user_netid: string;
  messages: BackendMessage[];
  detected_tags?: string[];
  created_at: string;
  updated_at?: string | null;
}

/**
 * Single message in a conversation
 */
export interface BackendMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

/**
 * User tag with confidence score from backend tag_service.py
 */
export interface BackendUserTag {
  id: string;
  user_netid: string;
  tag_name: string;
  confidence: number;
  source: 'onboarding' | 'chat' | 'event_rsvp' | 'event_decline' | 'manual';
  created_at: string;
  updated_at?: string | null;
}

/**
 * Tag suggestion for onboarding
 */
export interface TagSuggestion {
  id: string;
  name: string;
  category: string;
  display_name?: string;
}

/**
 * RSO (Registered Student Organization) from backend
 */
export interface BackendRso {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  created_at: string;
}
