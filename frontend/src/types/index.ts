/**
 * Organization
 * Represents a university or institution using the platform.
 */
export interface Organization {
  /** Unique identifier */
  id: string;
  /** Display name (e.g., "University of Washington") */
  name: string;
  /** Email domains for this org (e.g., ["uw.edu"]) */
  domains: string[];
  /** Visual branding configuration */
  branding: {
    primaryColor: string;
    secondaryColor?: string;
    logoUrl?: string;
  };
  /** Options shown during user onboarding */
  onboardingConfig: {
    majors: string[];
    campuses: string[];
    years: string[];
  };
}

/**
 * UserProfile
 * User's profile data stored after onboarding.
 */
export interface UserProfile {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Email address (must be .edu) */
  email: string;
  /** Organization this user belongs to */
  organizationId: string;
  /** User's major (optional) */
  major?: string;
  /** Graduation year (optional) */
  year?: string;
  /** Interest tags for personalization */
  tags: string[];
}

/**
 * ContentType
 * Types of content that can appear in the feed.
 */
export type ContentType = 'event' | 'club' | 'announcement';

/**
 * ContentItem
 * A single piece of content (event, club, or announcement).
 */
export interface ContentItem {
  /** Unique identifier */
  id: string;
  /** Organization that owns this content */
  organizationId: string;
  /** Type of content */
  type: ContentType;
  /** Title displayed in feed */
  title: string;
  /** Full description */
  description: string;
  /** Tags for filtering/matching */
  tags: string[];
  /** Event date (ISO string, optional) */
  date?: string;
  /** Event location (optional) */
  location?: string;
  /** Primary image URL (optional) */
  imageUrl?: string;
  /** GPS coordinates for map display */
  coordinates?: { lat: number; lng: number };
  /** Attendance info */
  attendees?: { count: number; friends: string[] };
  /** Additional images */
  images?: string[];
  /** Expiring story content */
  stories?: { id: string; imageUrl: string; expiresAt: string }[];
  /** AI-generated summary */
  aiSummary?: string;
}

/**
 * Tag
 * A categorized tag for filtering content or user interests.
 */
export interface Tag {
  /** Unique identifier */
  id: string;
  /** Display text */
  label: string;
  /** Tag category for grouping */
  category: 'topic' | 'identity' | 'career' | 'major';
}

/**
 * RsvpStatus
 * User's response to an event.
 */
export type RsvpStatus = 'going' | 'interested' | 'not_going' | null;

/**
 * RSVP
 * A user's RSVP record for a content item.
 */
export interface RSVP {
  /** Content item being RSVP'd to */
  contentId: string;
  /** User making the RSVP */
  userId: string;
  /** Current RSVP status */
  status: RsvpStatus;
  /** When the RSVP was made (ISO string) */
  timestamp?: string;
}

/**
 * ToastType
 * Visual style of a toast notification.
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * ToastAction
 * Optional action button on a toast.
 */
export interface ToastAction {
  /** Button text */
  label: string;
  /** Callback when clicked */
  onClick: () => void;
}

/**
 * Toast
 * A toast notification message.
 */
export interface Toast {
  /** Unique identifier */
  id: string;
  /** Message to display */
  message: string;
  /** Visual style */
  type: ToastType;
  /** Optional action button */
  action?: ToastAction;
}

/**
 * UserRole
 * Permission levels in the system.
 * - user: Regular student browsing events
 * - contributor: Can submit events (after approval)
 * - admin: Can approve contributors
 */
export type UserRole = 'user' | 'contributor' | 'admin';

/**
 * AuthState
 * Current authentication state.
 */
export interface AuthState {
  /** Whether user is authenticated */
  isAuth: boolean;
  /** User's unique ID (null if not authenticated) */
  id: string | null;
  /** User's email (null if not authenticated) */
  email: string | null;
  /** User's permission level */
  role: UserRole;
}

/**
 * ContributorStatus
 * Status of a contributor access request.
 */
export type ContributorStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * ContributorRequest
 * A request for contributor access, pending admin approval.
 */
export interface ContributorRequest {
  /** Unique identifier */
  id: string;
  /** Requester's email */
  email: string;
  /** Requester's name */
  name: string;
  /** Why they want contributor access */
  reason: string;
  /** Current request status */
  status: ContributorStatus;
  /** When request was submitted (ISO string) */
  requestedAt: string;
  /** When admin reviewed (ISO string, optional) */
  reviewedAt?: string;
  /** Admin who reviewed (optional) */
  reviewedBy?: string;
}

/**
 * RsvpSummary
 * Aggregate RSVP counts for a content item.
 */
export interface RsvpSummary {
  /** Number of users marked as going */
  going: number;
  /** Number of users marked as interested */
  interested: number;
  /** Number of users marked as not going */
  notGoing: number;
}