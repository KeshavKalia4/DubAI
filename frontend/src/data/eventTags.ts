/**
 * Event Tags
 *
 * Predefined tag categories for event classification.
 * Used by contributors when creating events and for filtering in the feed.
 */

export interface EventTag {
  id: string;
  label: string;
  emoji: string;
}

export const EVENT_TAGS: EventTag[] = [
  { id: 'academic', label: 'Academic', emoji: '🎓' },
  { id: 'career', label: 'Career', emoji: '💼' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨' },
  { id: 'sports', label: 'Sports & Fitness', emoji: '⚽' },
  { id: 'community', label: 'Community Service', emoji: '🌍' },
  { id: 'wellness', label: 'Wellness', emoji: '🧠' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'food', label: 'Food & Dining', emoji: '🍕' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'study', label: 'Study Groups', emoji: '📚' },
  { id: 'networking', label: 'Networking', emoji: '🌐' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎭' },
];

// Helper to get tag by ID
export function getTagById(id: string): EventTag | undefined {
  return EVENT_TAGS.find((tag) => tag.id === id);
}

// Helper to get multiple tags by IDs
export function getTagsByIds(ids: string[]): EventTag[] {
  return ids.map((id) => getTagById(id)).filter((tag): tag is EventTag => tag !== undefined);
}
