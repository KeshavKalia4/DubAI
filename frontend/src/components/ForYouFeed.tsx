'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { MapPin, Trash2, Calendar, Sparkles, Loader2, AlertCircle, Users } from 'lucide-react';
import { ContentItem, UserProfile } from '../types';
import { useEvents } from '../hooks/useEvents';
import { generateReelsOrder } from '@/utils/reelsRecommendations';
import ReelsView from './ReelsView';

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
  // Pass user.id to useEvents for personalized feed from API
  const { events, deleteEvent, isLoaded, isLoading, error } = useEvents({ userNetid: user.id });

  // Reels state
  const [reelsState, setReelsState] = useState<{
    isOpen: boolean;
    startingEventId: string | null;
    sortedEvents: ContentItem[];
  }>({
    isOpen: false,
    startingEventId: null,
    sortedEvents: []
  });

  const recommendations = useMemo(() => {
    if (!isLoaded) return [];

    // Skip organization filter for now - show all events
    // TODO: Re-enable organization filtering when backend supports it
    // const orgContent = events.filter(
    //   (item) => item.organizationId === user.organizationId
    // );

    // 2. Score Content
    const scoredContent = events.map((item) => {
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

  // Reels handlers
  const handleOpenReels = useCallback((eventId: string) => {
    const sortedReels = generateReelsOrder(recommendations, eventId, user);
    setReelsState({
      isOpen: true,
      startingEventId: eventId,
      sortedEvents: sortedReels
    });
  }, [recommendations, user]);

  const handleCloseReels = useCallback(() => {
    setReelsState({
      isOpen: false,
      startingEventId: null,
      sortedEvents: []
    });
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Header Section */}
      <div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#d4d4d4] bg-clip-text text-transparent tracking-tight mb-2">
          For You
        </h2>
        <p className="text-sm sm:text-base text-[#a3a3a3]">Personalized recommendations based on your interests</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 sm:py-24">
          <div className="relative">
            <div className="absolute inset-0 bg-[#8268bc]/20 rounded-full blur-3xl"></div>
            <div className="relative bg-[#2a1f47]/80 backdrop-blur-sm border-2 border-[#8268bc]/30 rounded-3xl p-12">
              <Loader2 className="w-16 h-16 text-[#8268bc] mx-auto mb-4 animate-spin" />
              <p className="text-[#d4d4d4] text-lg sm:text-xl font-semibold">Loading events...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 sm:py-24">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-[#2a1f47]/80 backdrop-blur-sm border-2 border-red-500/30 rounded-3xl p-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-[#d4d4d4] text-lg sm:text-xl font-semibold mb-2">Failed to load events</p>
              <p className="text-[#a3a3a3] text-sm sm:text-base">{error}</p>
              <p className="text-[#a3a3a3] text-sm mt-2">Showing cached content instead</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {recommendations.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              onDelete={deleteEvent}
              index={index}
              onOpenReels={handleOpenReels}
            />
          ))}
        </div>
      ) : !isLoading && !error && (
        <div className="text-center py-20 sm:py-24">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#8268bc]/20 rounded-full blur-3xl"></div>
            <div className="relative bg-[#2a1f47]/80 backdrop-blur-sm border-2 border-[#8268bc]/30 rounded-3xl p-12">
              <Sparkles className="w-16 h-16 text-[#8268bc] mx-auto mb-4 opacity-50" />
              <p className="text-[#d4d4d4] text-lg sm:text-xl font-semibold mb-2">No recommendations yet</p>
              <p className="text-[#a3a3a3] text-sm sm:text-base">Try adding more interests to see personalized content!</p>
            </div>
          </div>
        </div>
      )}

      {/* Reels View */}
      {reelsState.isOpen && (
        <ReelsView
          events={reelsState.sortedEvents}
          onClose={handleCloseReels}
        />
      )}
    </div>
  );
};

const ContentCard: React.FC<{
  item: ContentItem;
  onDelete: (eventId: string) => boolean;
  index: number;
  onOpenReels: (eventId: string) => void;
}> = ({ item, onDelete, index, onOpenReels }) => {
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
      onClick={() => onOpenReels(item.id)}
      className={`
        group relative bg-linear-to-br from-[#1e1432]/95 to-[#2a1f47]/80 rounded-2xl p-5 sm:p-6
        border-2 border-[#8268bc]/30
        shadow-[0_8px_30px_rgba(107,78,168,0.25)]
        hover:shadow-[0_20px_60px_rgba(107,78,168,0.4)]
        hover:border-[#8268bc]/60
        hover:scale-[1.03] hover:-translate-y-2
        transition-all duration-500 ease-out
        cursor-pointer overflow-hidden
        h-full
        backdrop-blur-md
        animate-fade-in
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* Header with Type Badge and Date */}
        <div className="flex justify-between items-start mb-4">
          <span className={`
            text-xs font-bold px-4 py-2 rounded-lg
            ${colors.bg} ${colors.text}
            border-2 border-current/30
            shadow-md
            backdrop-blur-sm
          `}>
            {capitalize(item.type)}
          </span>
          <div className="flex items-center gap-2">
            {item.date && (
              <span className="flex items-center gap-1.5 text-xs text-[#d4d4d4] font-bold bg-[#2a1f47]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#8268bc]/20" suppressHydrationWarning>
                <Calendar className="w-3 h-3" />
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {isCustomEvent && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-[#2a1f47]/60 hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-400/30"
                aria-label="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col space-y-3">
          <h3 className="font-bold text-[#f5f5f5] text-lg sm:text-xl leading-tight group-hover:text-white transition-colors">
            {item.title}
          </h3>
          {item.rsoName && (
            <div className="flex items-center gap-2 text-[#8268bc]">
              <Users className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{item.rsoName}</span>
            </div>
          )}
          <p className="text-[#d4d4d4] text-sm leading-relaxed line-clamp-3 group-hover:text-[#e0e0e0] transition-colors">
            {item.description}
          </p>
          {item.location && (
            <div className="flex items-center gap-2.5 bg-[#2a1f47]/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-[#8268bc]/10 group-hover:border-[#8268bc]/30 transition-all">
              <MapPin className="w-4 h-4 text-[#8268bc] shrink-0" />
              <span className="text-sm text-[#d4d4d4] font-medium truncate">
                {item.location}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#362955]/50 group-hover:border-[#8268bc]/30 transition-colors">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#362955]/60 text-[#8268bc] border border-[#8268bc]/30 backdrop-blur-sm hover:bg-[#8268bc]/20 hover:scale-105 transition-all"
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
