'use client';

import React, { useMemo } from 'react';
import { MapPin, Trash2 } from 'lucide-react';
import { ContentItem, UserProfile } from '../types';
import { useEvents } from '../hooks/useEvents';

interface ForYouFeedProps {
  user: UserProfile;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Type to badge color mapping - UW themed
const typeColors: Record<string, { border: string; bg: string; text: string; accent: string }> = {
  event: {
    border: 'border-l-[#4B2E83]',
    bg: 'bg-[#f5f0ff]',
    text: 'text-[#4B2E83]',
    accent: '#4B2E83'
  },
  club: {
    border: 'border-l-[#B7A57A]',
    bg: 'bg-[#faf8f3]',
    text: 'text-[#8b7a5a]',
    accent: '#B7A57A'
  },
  opportunity: {
    border: 'border-l-[#5d3a9b]',
    bg: 'bg-[#f8f5ff]',
    text: 'text-[#5d3a9b]',
    accent: '#5d3a9b'
  },
  announcement: {
    border: 'border-l-[#d4c79f]',
    bg: 'bg-[#fffef9]',
    text: 'text-[#9b8b6a]',
    accent: '#d4c79f'
  },
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
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#f5f5f5] tracking-tight">For You</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {recommendations.map((item) => (
          <ContentCard key={item.id} item={item} onDelete={deleteEvent} />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-[#a3a3a3] text-base sm:text-lg px-4">No recommendations found. Try adding more interests!</p>
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
        group relative bg-[#1e1432]/95 rounded-2xl p-4 sm:p-5 md:p-6
        border-l-4 ${colors.border}
        border border-[#362955]
        shadow-[0_2px_12px_rgba(107,78,168,0.15)]
        hover:shadow-[0_8px_32px_rgba(107,78,168,0.25)]
        hover:scale-[1.02] hover:-translate-y-1
        transition-all duration-300 ease-out
        cursor-pointer overflow-hidden
        h-full
        backdrop-blur-sm
      `}
    >
      {/* Gradient overlay with UW purple theme */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.accent}08 0%, transparent 60%)`
        }}
      />

      {/* Accent glow effect */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: colors.accent
        }}
      />

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className={`
            text-xs font-semibold px-3 py-1.5 rounded-lg
            ${colors.bg} ${colors.text}
            border border-current/20
            shadow-sm
          `}>
            {capitalize(item.type)}
          </span>
          <div className="flex items-center gap-2">
            {item.date && (
              <span className="text-xs text-[#a3a3a3] font-semibold bg-[#2a1f47]/50 px-2.5 py-1 rounded-lg" suppressHydrationWarning>
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {isCustomEvent && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-900/20 text-gray-500 hover:text-red-400 transition-all"
                aria-label="Delete event"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold mb-2 text-[#f5f5f5] text-base sm:text-lg leading-snug">
            {item.title}
          </h3>
          <p className="text-[#d4d4d4] mb-3 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          {item.location && (
            <div className="flex items-center gap-2 mb-4 bg-[#2a1f47] px-3 py-2 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-[#8268bc] shrink-0" />
              <span className="text-xs text-[#d4d4d4] font-medium truncate">
                {item.location}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-[#362955]">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#362955] text-[#8268bc] border border-[#8268bc]/20"
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
