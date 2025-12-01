'use client';

import React, { useMemo } from 'react';
import { MapPin, Trash2 } from 'lucide-react';
import { ContentItem, UserProfile } from '../types';
import { useEvents } from '../hooks/useEvents';

interface ForYouFeedProps {
  user: UserProfile;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Type to badge color mapping
const typeColors: Record<string, { bg: string; text: string }> = {
  event: { bg: 'bg-purple-50', text: 'text-purple-700' },
  club: { bg: 'bg-blue-50', text: 'text-blue-700' },
  opportunity: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  announcement: { bg: 'bg-amber-50', text: 'text-amber-700' },
};

const ForYouFeed: React.FC<ForYouFeedProps> = ({ user }) => {
  const { events, deleteEvent, isLoaded } = useEvents();

  const recommendations = useMemo(() => {
    if (!isLoaded) return [];

    // 1. Filter by Organization
    const orgContent = events.filter(
      (item) => item.organizationId === user.organizationId
    );

    // 2. Score Content
    const scoredContent = orgContent.map((item) => {
      let score = 0;

      // Exact tag matches
      const matchingTags = item.tags.filter((tag) => user.tags.includes(tag));
      score += matchingTags.length * 5;

      // Major match (if content tag matches user major)
      if (user.major && item.tags.includes(user.major.toLowerCase())) {
        score += 10;
      }

      // Identity match (simple check for now)
      if (user.year === 'Freshman' && item.tags.includes('freshman')) {
        score += 5;
      }

      return { item, score };
    });

    // 3. Sort by Score (Descending)
    return scoredContent
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [user, events, isLoaded]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">For You</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {recommendations.map((item) => (
          <ContentCard key={item.id} item={item} onDelete={deleteEvent} />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-gray-400 dark:text-gray-500 text-base sm:text-lg px-4">No recommendations found. Try adding more interests!</p>
        </div>
      )}
    </div>
  );
};

const ContentCard: React.FC<{
  item: ContentItem;
  onDelete: (eventId: string) => boolean;
}> = ({ item, onDelete }) => {
  const colors = typeColors[item.type] || typeColors.event;
  const isCustomEvent = item.id.startsWith('custom-');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete(item.id);
    }
  };

  return (
    <div
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6
        border border-gray-200 dark:border-gray-700
        shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        cursor-pointer overflow-hidden
        h-full
      `}
    >
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 sm:mb-2">
          <span className={`text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 -ml-2.5 rounded-full ${colors.bg} dark:opacity-90 ${colors.text}`}>
            {capitalize(item.type)}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {item.date && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium" suppressHydrationWarning>
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {isCustomEvent && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                aria-label="Delete event"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white text-base sm:text-lg">
            {item.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-3 text-xs sm:text-sm line-clamp-2">
            {item.description}
          </p>
          {item.location && (
            <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
              <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                {item.location}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-400 dark:text-gray-500 font-medium"
            >
              #{capitalize(tag)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForYouFeed;
