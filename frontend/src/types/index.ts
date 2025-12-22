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

// Auth Types

/**
 * User roles in the system
 * - user: Regular student browsing events
 * - contributor: Can submit events (after approval)
 * - admin: Can approve contributors (future)
 */
export type UserRole = 'user' | 'contributor' | 'admin';

/**
 * Authentication state
 * Tracks whether user is logged in and basic identity
 */
export interface AuthState {
  isAuth: boolean;
  id: string | null;
  email: string | null;
  role: UserRole;
}

/**
 * Contributor request status
 */
export type ContributorStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * A contributor's access request
 * Stored until admin approves/rejects
 */
export interface ContributorRequest {
  id: string;
  email: string;
  name: string;
  reason: string;
  status: ContributorStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

