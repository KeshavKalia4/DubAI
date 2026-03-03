import { ContentItem, UserProfile, RsvpStatus } from '@/types';

// Backend event response type (matches actual Supabase schema)
export interface BackendEvent {
  id: string;
  rso_id: string | null;
  title: string;
  description: string;
  date_time: string;
  location: string;
  tags: string[];
  image_path?: string;  // Supabase uses image_path
  link?: string;
  rsvp?: number;  // RSVP count
  coordinates?: { lat: number; lng: number };
  created_at?: string;
  rsos?: {
    name: string;
    is_verified?: boolean;
  } | null;
}

// Backend user response type
export interface BackendUser {
  netid: string;
  name: string;
  email: string;
  major?: string;
  year?: string;
  onboarding_completed?: boolean;
  tags?: Array<{ tag_name: string; confidence_score: number }>;
}

// Map backend event to frontend ContentItem
export function mapEventToContentItem(event: BackendEvent): ContentItem {
  return {
    id: event.id,
    organizationId: 'uw-seattle', // Default organization
    type: 'event',
    title: event.title,
    description: event.description,
    tags: event.tags || [],
    date: event.date_time,
    location: event.location,
    imageUrl: event.image_path,  // Map image_path to imageUrl
    coordinates: event.coordinates,
    attendees: event.rsvp !== undefined
      ? { count: event.rsvp, friends: [] }
      : { count: 0, friends: [] },
  };
}

// Map array of backend events to ContentItems
export function mapEventsToContentItems(events: BackendEvent[]): ContentItem[] {
  return events.map(mapEventToContentItem);
}

// Map backend user to frontend UserProfile
export function mapUserToProfile(user: BackendUser): UserProfile {
  return {
    id: user.netid,
    name: user.name,
    email: user.email,
    organizationId: 'uw-seattle', // Default organization
    major: user.major,
    year: user.year,
    tags: user.tags?.map(t => t.tag_name) || [],
  };
}

// Map frontend UserProfile to backend format for creation/update
export function mapProfileToBackendUser(profile: UserProfile): Partial<BackendUser> {
  return {
    netid: profile.id,
    name: profile.name,
    email: profile.email,
    major: profile.major,
    year: profile.year,
  };
}

// Map backend RSVP status to frontend RsvpStatus
export function mapBackendRsvpStatus(status: string | null): RsvpStatus {
  if (!status) return null;
  switch (status.toLowerCase()) {
    case 'going':
    case 'rsvp':
      return 'going';
    case 'interested':
    case 'maybe':
      return 'interested';
    case 'not_going':
    case 'decline':
    case 'declined':
      return 'not_going';
    default:
      return null;
  }
}
