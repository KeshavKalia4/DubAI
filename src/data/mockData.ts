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
    description: 'The largest student-run hackathon in the PNW. Join us to build amazing projects.',
    tags: ['tech', 'career', 'social'],
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Informatics Career Fair',
    description: 'Meet top employers looking for Informatics students.',
    tags: ['tech', 'career', 'business'],
    date: '2025-11-25T10:00:00Z',
    location: 'HUB Ballroom',
  },
  {
    id: '3',
    organizationId: 'uw-seattle',
    type: 'club',
    title: 'Husky Coding Project',
    description: 'Learn to code by building real projects in teams.',
    tags: ['tech', 'freshman'],
  },
  {
    id: '4',
    organizationId: 'uw-seattle',
    type: 'event',
    title: 'Freshman Welcome Mixer',
    description: 'Meet other incoming freshmen and make new friends!',
    tags: ['social', 'freshman'],
    date: '2025-09-25T18:00:00Z',
    location: 'Red Square',
  },
  {
    id: '5',
    organizationId: 'wsu-pullman',
    type: 'event',
    title: 'Cougar Football Tailgate',
    description: 'Join us before the big game!',
    tags: ['social', 'sports'],
    date: '2025-10-12T12:00:00Z',
  },
];
