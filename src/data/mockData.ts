import { ContentItem, Tag } from '../types';

export const availableTags: Tag[] = [
  { id: 'tech', label: 'Technology', category: 'topic' },
  { id: 'art', label: 'Art & Design', category: 'topic' },
  { id: 'business', label: 'Business', category: 'topic' },
  { id: 'social', label: 'Social', category: 'topic' },
  { id: 'career', label: 'Career Development', category: 'career' },
  { id: 'research', label: 'Research', category: 'career' },
  { id: 'freshman', label: 'Freshman Friendly', category: 'identity' },
  { id: 'transfer', label: 'Transfer Students', category: 'identity' },
];

export const mockContent: ContentItem[] = [
  {
    id: '1',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'DubHacks',
    description: 'The largest student-run hackathon in the PNW. Join us to build amazing projects, meet sponsors, and win prizes. No experience needed!',
    tags: ['tech', 'career', 'social'],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'
    ],
    location: 'HUB',
    coordinates: { lat: 47.6553, lng: -122.3050 }, // HUB
    attendees: { count: 450, friends: ['Alex', 'Sarah', 'Jordan'] },
    aiSummary: '✨ High energy, free food, great for resume building.',
    stories: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500', expiresAt: '2025-11-22T10:00:00Z' }
    ]
  },
  {
    id: '2',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Informatics Career Fair',
    description: 'Meet top employers looking for Informatics students. Bring your resume and dress business casual.',
    tags: ['tech', 'career', 'business'],
    date: '2025-11-25T10:00:00Z',
    location: 'Mary Gates Hall',
    coordinates: { lat: 47.6551, lng: -122.3078 }, // Mary Gates Hall
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 120, friends: ['Mike', 'Emily'] },
    aiSummary: '✨ Professional attire required. Top tech companies attending.',
    stories: [
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500', expiresAt: '2025-11-26T10:00:00Z' }
    ]
  },
  {
    id: '3',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'Husky Coding Project',
    description: 'Learn to code by building real projects in teams. We pair you with a mentor and a group of students.',
    tags: ['tech', 'freshman'],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    location: 'Paul G. Allen Center (CSE)',
    coordinates: { lat: 47.6531, lng: -122.3058 }, // Paul G. Allen Center
    attendees: { count: 85, friends: [] },
    aiSummary: '✨ Beginner friendly. Great way to make friends in CS.',
    stories: [
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=500', expiresAt: '2025-11-22T15:00:00Z' }
    ]
  },
  {
    id: '4',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Freshman Welcome Mixer',
    description: 'Meet other incoming freshmen and make new friends! Free ice cream and games.',
    tags: ['social', 'freshman'],
    date: '2025-09-25T18:00:00Z',
    location: 'Red Square',
    coordinates: { lat: 47.6563, lng: -122.3094 }, // Red Square
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 300, friends: ['Jessica', 'David', 'Sam'] },
    aiSummary: '✨ Very casual. Free food. High attendance expected.'
  },
  {
    id: '5',
    organizationId: 'wsu-pullman',
    type: 'event',
    title: 'Cougar Football Tailgate',
    description: 'Join us before the big game! BBQ, music, and school spirit.',
    tags: ['social', 'sports'],
    date: '2025-10-12T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1504159506876-f8338247a14a?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 2000, friends: [] }
  },
  // Additional UW events with real campus locations
  {
    id: '6',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Study Abroad Info Session',
    description: 'Learn about study abroad opportunities in Europe, Asia, and South America. Scholarships available!',
    tags: ['career', 'social'],
    date: '2025-11-22T14:00:00Z',
    location: 'Suzzallo Library',
    coordinates: { lat: 47.6556, lng: -122.3080 }, // Suzzallo Library
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 45, friends: ['Maria'] },
    aiSummary: '✨ Free pizza. Learn about funding opportunities.'
  },
  {
    id: '7',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'UW Sailing Club',
    description: 'Learn to sail on Lake Washington! No experience necessary. We provide all equipment.',
    tags: ['social', 'sports'],
    location: 'Waterfront Activities Center',
    coordinates: { lat: 47.6498, lng: -122.3012 }, // WAC
    imageUrl: 'https://images.unsplash.com/photo-1534372899512-58c5f8b4db0e?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 120, friends: [] },
    aiSummary: '✨ Great for stress relief. Beautiful lake views.'
  },
  {
    id: '8',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Husky Football vs Oregon',
    description: 'The big rivalry game! Student section opens at 4pm. Purple out!',
    tags: ['social', 'sports'],
    date: '2025-11-23T17:00:00Z',
    location: 'Husky Stadium',
    coordinates: { lat: 47.6505, lng: -122.3017 }, // Husky Stadium
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 12000, friends: ['Tyler', 'Emma', 'Chris'] },
    aiSummary: '✨ HUGE game. Get there early for best seats.'
  },
  {
    id: '9',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'Anime Club',
    description: 'Weekly screenings, manga discussions, and trips to conventions. All skill levels welcome!',
    tags: ['social', 'art'],
    location: 'Communications Building',
    coordinates: { lat: 47.6572, lng: -122.3058 }, // Communications
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 200, friends: ['Kenji'] },
    aiSummary: '✨ Chill vibes. Great community for anime fans.'
  },
  {
    id: '10',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Resume Workshop',
    description: 'Get your resume reviewed by industry professionals. RSVP required.',
    tags: ['career', 'tech'],
    date: '2025-11-21T15:00:00Z',
    location: 'Engineering Library',
    coordinates: { lat: 47.6541, lng: -122.3047 }, // Engineering Library
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 30, friends: [] },
    aiSummary: '✨ 1-on-1 feedback. Bring printed copies!'
  },
  {
    id: '11',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Open Mic Night',
    description: 'Share your poetry, music, or comedy! Sign up at 6pm, show starts at 7pm.',
    tags: ['art', 'social'],
    date: '2025-11-22T19:00:00Z',
    location: 'By George Cafe (HUB)',
    coordinates: { lat: 47.6550, lng: -122.3045 }, // HUB
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 75, friends: ['Luna', 'Marcus'] },
    aiSummary: '✨ Super fun. Great coffee and vibes.'
  },
  {
    id: '12',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'UW Pre-Med Society',
    description: 'Resources, mentorship, and community for pre-med students. Monthly speaker events.',
    tags: ['career', 'research'],
    location: 'Health Sciences Building',
    coordinates: { lat: 47.6507, lng: -122.3080 }, // Health Sciences
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    attendees: { count: 340, friends: ['Priya'] },
    aiSummary: '✨ Great networking. MCAT study groups available.'
  },
];
