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
