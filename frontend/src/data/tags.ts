import { Tag } from '../types';

/**
 * Available tags for filtering content and user interests.
 * Used by onboarding flow and content filtering.
 */
export const availableTags: Tag[] = [
  { id: 'tech', label: 'Technology', category: 'topic' },
  { id: 'art', label: 'Art & Design', category: 'topic' },
  { id: 'business', label: 'Business', category: 'topic' },
  { id: 'social', label: 'Social', category: 'topic' },
  { id: 'sports', label: 'Sports', category: 'topic' },
  { id: 'career', label: 'Career Development', category: 'career' },
  { id: 'research', label: 'Research', category: 'career' },
  { id: 'freshman', label: 'Freshman Friendly', category: 'identity' },
  { id: 'transfer', label: 'Transfer Students', category: 'identity' },
];

/**
 * Get tag by ID.
 */
export function getTagById(id: string): Tag | undefined {
  return availableTags.find((tag) => tag.id === id);
}

/**
 * Get tags by category.
 */
export function getTagsByCategory(category: Tag['category']): Tag[] {
  return availableTags.filter((tag) => tag.category === category);
}
