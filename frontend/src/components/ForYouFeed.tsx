'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { ContentItem, UserProfile } from '../types';
import { useEvents } from '../hooks/useEvents';
import { generateReelsOrder } from '@/utils/reelsRecommendations';
import ReelsView from './ReelsView';
import { useToast } from '@/hooks/useToast';
import { ContentCard } from './ContentCard';
import { usePreviewEvent } from '../hooks/usePreviewEvent';

interface ForYouFeedProps {
  user: UserProfile;
}

const ForYouFeed: React.FC<ForYouFeedProps> = ({ user }) => {
  const { events, deleteEvent, finalizePreview, isLoaded } = useEvents();
  const { toast } = useToast();

  // Capture current time once per component mount for "recently created" checks
  // eslint-disable-next-line react-hooks/purity
  const currentTime = useMemo(() => Date.now(), []);

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

  // Preview event management (centralized in custom hook)
  const { previewEvent, deletePreviewEvent: clearPreviewEvent } = usePreviewEvent();

  // Combine preview with recommendations
  const allEvents = useMemo(() => {
    if (!previewEvent) return recommendations;
    return [
      previewEvent,
      ...recommendations.filter(e => !e.id.startsWith('preview-'))
    ];
  }, [previewEvent, recommendations]);

  // Handle preview delete
  const handlePreviewDelete = (eventId: string) => {
    if (eventId.startsWith('preview-')) {
      clearPreviewEvent();
      toast.info('Preview deleted');
      return true;
    }
    return deleteEvent(eventId);
  };

  // Handle preview finalize
  const handlePreviewFinalize = (previewId: string): ContentItem | null => {
    const result = finalizePreview(previewId);
    if (result) {
      // Clear preview using hook (updates both state and sessionStorage)
      clearPreviewEvent();
    }
    return result;
  };

  // Reels handlers
  const handleOpenReels = useCallback((eventId: string) => {
    const sortedReels = generateReelsOrder(recommendations, eventId);
    setReelsState({
      isOpen: true,
      startingEventId: eventId,
      sortedEvents: sortedReels
    });
  }, [recommendations]);

  const handleCloseReels = useCallback(() => {
    setReelsState({
      isOpen: false,
      startingEventId: null,
      sortedEvents: []
    });
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Main Feed Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent">
          For You
        </h2>
        <p className="text-sm sm:text-base text-[#a3a3a3] mt-1">Personalized recommendations based on your interests</p>
      </div>

      {/* Content Grid - includes preview at top if exists */}
      {allEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {allEvents.map((item, index) => (
            <ContentCard
              key={item.id}
              item={item}
              isPreview={item.id.startsWith('preview-')}
              showSubmitButton={item.id.startsWith('preview-')}
              onDelete={handlePreviewDelete}
              onFinalize={handlePreviewFinalize}
              index={index}
              onOpenReels={handleOpenReels}
              currentTime={currentTime}
              toast={toast}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 sm:py-24">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#8268bc]/20 rounded-full blur-3xl"></div>
            <div className="relative bg-[#2a1f47]/80 backdrop-blur-sm border-2 border-[#8268bc]/30 rounded-3xl p-12">
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

export default ForYouFeed;
