import { ContentItem } from '../types';
import { getCoordinates } from './locations';

// Re-export for backward compatibility
export { availableTags } from './tags';

/**
 * Helper to create event with auto-derived coordinates.
 * If coordinates not explicitly provided, derives from location string.
 */
function createEvent(
  event: Omit<ContentItem, 'coordinates'> & {
    coordinates?: ContentItem['coordinates'];
  }
): ContentItem {
  return {
    ...event,
    coordinates:
      event.coordinates ?? getCoordinates(event.location) ?? undefined,
  };
}

/**
 * Real UW Seattle clubs and events - Single Source of Truth
 *
 * Coordinates are derived from location strings using the lookup system.
 * Optional fields (images, stories) can be added per-item as needed.
 */
export const uwEvents: ContentItem[] = [
  // === Original uwEvents (10 items) ===
  createEvent({
    id: 'hcp',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'Husky Coding Project',
    description:
      'Build real projects in teams with peer mentorship. No experience needed!',
    tags: ['tech', 'career', 'freshman'],
    location: 'More Hall 220',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 915, friends: [] },
    aiSummary: 'Beginner friendly. Great for building your portfolio.',
  }),
  createEvent({
    id: 'dubhacks',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'DubHacks 2025',
    description:
      "PNW's largest student hackathon - 24 hours of building, learning, and fun!",
    tags: ['tech', 'career', 'social'],
    date: '2025-10-18T09:00:00Z',
    location: 'HUB',
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop',
    ],
    attendees: { count: 400, friends: [] },
    aiSummary: 'Free food, mentors, prizes. All skill levels welcome.',
    stories: [
      {
        id: 's1',
        imageUrl:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500',
        expiresAt: '2025-11-22T10:00:00Z',
      },
    ],
  }),
  createEvent({
    id: 'acm',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'ACM UW Chapter',
    description:
      'CS community building, Big/Little mentorship, and networking events.',
    tags: ['tech', 'career', 'social'],
    location: 'Paul G. Allen Center',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 300, friends: [] },
    aiSummary: 'Quarterly socials. Great mentorship program.',
  }),
  createEvent({
    id: 'adp',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'Anime Discovery Project',
    description: 'Weekly anime viewings, social outings, and Sakura-Con trips!',
    tags: ['social', 'art'],
    location: 'PAA A110',
    imageUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 200, friends: [] },
    aiSummary: 'Fridays 6pm. Chill vibes, great community.',
  }),
  createEvent({
    id: 'fall-fling',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Fall Fling Concert',
    description: 'ASUW welcome concert during Dawg Daze featuring live music!',
    tags: ['social', 'art'],
    location: 'Red Square',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 2000, friends: [] },
    aiSummary: 'FREE concert. Great way to meet people.',
  }),
  createEvent({
    id: 'springfest',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'SpringFest',
    description:
      'Biggest event of the year - carnival games, music, food, and fun!',
    tags: ['social'],
    location: 'Red Square',
    imageUrl:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 5000, friends: [] },
    aiSummary: "Don't miss this! Petting zoo, games, live music.",
  }),
  createEvent({
    id: 'w-day',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'W Day',
    description: "UW's birthday celebration - Purple Pride campus-wide!",
    tags: ['social'],
    date: '2025-11-01T10:00:00Z',
    location: 'Red Square',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 10000, friends: [] },
    aiSummary: 'November 1st tradition. Wear purple!',
  }),
  createEvent({
    id: 'intramurals',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'IMA Sports',
    description: 'Flag football, volleyball, basketball leagues and more!',
    tags: ['social', 'sports'],
    location: 'IMA',
    imageUrl:
      'https://images.unsplash.com/photo-1461896836934-408fe0?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 1500, friends: [] },
    aiSummary: '$35/quarter unlimited. All skill levels.',
  }),
  createEvent({
    id: 'husky-football',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Husky Football',
    description:
      'Cheer on the Dawgs at Husky Stadium! Student section opens early.',
    tags: ['social', 'sports'],
    location: 'Husky Stadium',
    imageUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 12000, friends: [] },
    aiSummary: 'Get there early for best seats!',
  }),
  createEvent({
    id: 'sailing-club',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'UW Sailing Club',
    description: 'Learn to sail on Lake Washington! No experience necessary.',
    tags: ['social', 'sports'],
    location: 'Waterfront Activities Center',
    imageUrl:
      'https://images.unsplash.com/photo-1534372899512-58c5f8b4db0e?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 120, friends: [] },
    aiSummary: 'Equipment provided. Beautiful lake views.',
  }),

  // === Merged from mockData (unique events only) ===
  createEvent({
    id: 'info-career-fair',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Informatics Career Fair',
    description:
      'Meet top employers looking for Informatics students. Bring your resume and dress business casual.',
    tags: ['tech', 'career', 'business'],
    date: '2025-11-25T10:00:00Z',
    location: 'Mary Gates Hall',
    imageUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 120, friends: [] },
    aiSummary: 'Professional attire required. Top tech companies attending.',
    stories: [
      {
        id: 's2',
        imageUrl:
          'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500',
        expiresAt: '2025-11-26T10:00:00Z',
      },
    ],
  }),
  createEvent({
    id: 'freshman-mixer',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Freshman Welcome Mixer',
    description:
      'Meet other incoming freshmen and make new friends! Free ice cream and games.',
    tags: ['social', 'freshman'],
    date: '2025-09-25T18:00:00Z',
    location: 'Red Square',
    imageUrl:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 300, friends: [] },
    aiSummary: 'Very casual. Free food. High attendance expected.',
  }),
  createEvent({
    id: 'study-abroad',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Study Abroad Info Session',
    description:
      'Learn about study abroad opportunities in Europe, Asia, and South America. Scholarships available!',
    tags: ['career', 'social'],
    date: '2025-11-22T14:00:00Z',
    location: 'Suzzallo Library',
    imageUrl:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 45, friends: [] },
    aiSummary: 'Free pizza. Learn about funding opportunities.',
  }),
  createEvent({
    id: 'resume-workshop',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Resume Workshop',
    description:
      'Get your resume reviewed by industry professionals. RSVP required.',
    tags: ['career', 'tech'],
    date: '2025-11-21T15:00:00Z',
    location: 'Engineering Library',
    imageUrl:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 30, friends: [] },
    aiSummary: '1-on-1 feedback. Bring printed copies!',
  }),
  createEvent({
    id: 'open-mic',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Open Mic Night',
    description:
      'Share your poetry, music, or comedy! Sign up at 6pm, show starts at 7pm.',
    tags: ['art', 'social'],
    date: '2025-11-22T19:00:00Z',
    location: 'By George Cafe (HUB)',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 75, friends: [] },
    aiSummary: 'Super fun. Great coffee and vibes.',
  }),
  createEvent({
    id: 'pre-med',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'UW Pre-Med Society',
    description:
      'Resources, mentorship, and community for pre-med students. Monthly speaker events.',
    tags: ['career', 'research'],
    location: 'Health Sciences Building',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 340, friends: [] },
    aiSummary: 'Great networking. MCAT study groups available.',
  }),
];
