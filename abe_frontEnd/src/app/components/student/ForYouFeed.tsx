import React, { useMemo, useState, useCallback } from 'react';
import { MapPin, Trash2, Sparkles, Bookmark } from 'lucide-react';
import { ContentItem, UserProfile } from '@/types';
import { useEvents } from '@/hooks/useEvents';
import { generateReelsOrder } from '@/utils/reelsRecommendations';
import ReelsView from './ReelsView';
import { WaveDivider } from '@/components/ui/wave-divider';
import { NebulaBg } from '@/components/ui/nebula-bg';
import { GridPatternCard } from '@/components/ui/card-with-grid-ellipsis-pattern';
import { useNavigate } from 'react-router';
import { useSavedEvents } from '@/hooks/useSavedEvents';

interface ForYouFeedProps {
  user: UserProfile;
}

const typeDot: Record<string, { color: string; text: string }> = {
  event:        { color: '#b7a57a', text: 'text-[#b7a57a]' },
  club:         { color: '#7c5cbf', text: 'text-purple-400' },
  announcement: { color: 'rgba(255,255,255,0.25)', text: 'text-white/30' },
};

const ForYouFeed: React.FC<ForYouFeedProps> = ({ user }) => {
  // Pass user ID to useEvents for personalized feed from backend
  const { events, deleteEvent, isLoaded } = useEvents({
    userNetid: user.id,
    useFeed: true,
  });
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedEvents();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [reelsState, setReelsState] = useState<{
    isOpen: boolean;
    startingEventId: string | null;
    sortedEvents: ContentItem[];
  }>({ isOpen: false, startingEventId: null, sortedEvents: [] });

  const recommendations = useMemo(() => {
    if (!isLoaded) return [];
    // Don't filter by organizationId for API events - show all events
    return events
      .map(item => {
        let score = 0;
        const itemTags = item.tags || [];
        const userTags = user.tags || [];
        itemTags.filter(t => userTags.includes(t)).forEach(() => (score += 5));
        if (user.major && itemTags.includes(user.major.toLowerCase())) score += 10;
        if (user.year === 'Freshman' && itemTags.includes('freshman')) score += 5;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(e => e.item);
  }, [user, events, isLoaded]);

  const handleOpenReels = useCallback(
    (eventId: string) => {
      const sorted = generateReelsOrder(recommendations, eventId, user);
      setReelsState({ isOpen: true, startingEventId: eventId, sortedEvents: sorted });
    },
    [recommendations, user]
  );

  const handleCloseReels = useCallback(() => {
    setReelsState({ isOpen: false, startingEventId: null, sortedEvents: [] });
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-[#4b2e83]/40 border-t-[#b7a57a]" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-[#4b2e83] opacity-30" />
          <p className="text-sm font-semibold text-white/40">Nothing here yet</p>
          <p className="mt-1 text-xs text-white/20">Add more interests to see personalized content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      <NebulaBg preset="minimal" className="pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">For You</h2>
          <p className="text-xs text-white/25 font-mono uppercase tracking-[0.2em]">
            {recommendations.length} events · personalized
          </p>
        </div>

        <WaveDivider height={24} speed={14} opacity={0.6} />

        {recommendations.map((item, i) => {
          const isCustom = item.id.startsWith('custom-');
          const t = typeDot[item.type] ?? typeDot.announcement;
          const isHovered = hoveredId === item.id;
          const dateStr = item.date
            ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
            : null;

          return (
            <div key={item.id}>
              <GridPatternCard delay={i * 0.07}>
              <div
                className="group relative cursor-pointer py-4 transition-all duration-200"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/student/events/${item.id}`)}
              >
                {/* Background image bleed on hover */}
                {isHovered && item.imageUrl && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.07] transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(3px)',
                    }}
                  />
                )}

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-px rounded-full transition-all duration-300"
                  style={{ backgroundColor: isHovered ? t.color : 'transparent' }}
                />

                <div className="relative pl-5">
                  {/* Type + date row */}
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${t.text}`}>
                          {item.type}
                        </span>
                      </div>
                      {dateStr && (
                        <>
                          <span className="text-white/10">·</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                            {dateStr}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); toggleSave(item.id); }}
                        className="cursor-pointer transition-colors"
                        aria-label={isSaved(item.id) ? 'Unsave' : 'Save'}
                        style={{ color: isSaved(item.id) ? '#b7a57a' : 'rgba(255,255,255,0.2)' }}
                      >
                        <Bookmark
                          size={13}
                          style={{ fill: isSaved(item.id) ? '#b7a57a' : 'none' }}
                        />
                      </button>
                      {isCustom && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (confirm('Delete this event?')) deleteEvent(item.id);
                          }}
                          className="cursor-pointer text-white/20 transition hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-bold tracking-tight transition-colors duration-200 sm:text-3xl"
                    style={{ color: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)' }}
                  >
                    {item.title}
                  </h3>

                  {/* Description — appears on hover */}
                  <p
                    className="mt-1 max-w-xl text-sm leading-relaxed text-white/40 transition-all duration-200 line-clamp-2"
                    style={{ opacity: isHovered ? 1 : 0, maxHeight: isHovered ? '3em' : '0', overflow: 'hidden' }}
                  >
                    {item.description}
                  </p>

                  {/* Metadata */}
                  <div
                    className="mt-2 flex flex-wrap items-center gap-4 transition-opacity duration-200"
                    style={{ opacity: isHovered ? 0.9 : 0.35 }}
                  >
                    {item.location && (
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin size={11} className="shrink-0" style={{ color: t.color + '80' }} />
                        {item.location}
                      </span>
                    )}
                    {item.attendees?.count != null && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/25">
                        {item.attendees.count.toLocaleString()} attending
                      </span>
                    )}
                    {/* Tags */}
                    <div className="flex gap-1.5">
                      {(item.tags || []).slice(0, 3).map(tag => (
                        <span key={tag} className="font-mono text-[10px] text-white/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reels CTA — hover only */}
                  <div
                    className="mt-2 flex items-center gap-4 transition-all duration-200"
                    style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(4px)' }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: t.color }}>
                      → view details
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); handleOpenReels(item.id); }}
                      className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors"
                    >
                      reels
                    </button>
                  </div>
                </div>
              </div>
              </GridPatternCard>

              {i < recommendations.length - 1 && (
                <WaveDivider height={14} speed={20} opacity={0.3} />
              )}
            </div>
          );
        })}
      </div>

      {reelsState.isOpen && (
        <ReelsView events={reelsState.sortedEvents} onClose={handleCloseReels} />
      )}
    </div>
  );
};

export default ForYouFeed;
