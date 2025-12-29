'use client';

import { useMemo } from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { ContentItem } from '../types';
import { useToast } from '@/hooks/useToast';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { LocationButton } from './LocationButton';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

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

export interface ContentCardProps {
  item: ContentItem;
  isPreview?: boolean;
  showSubmitButton?: boolean;
  index?: number;
  onDelete: (eventId: string) => boolean;
  onFinalize?: (previewId: string) => ContentItem | null;
  onOpenReels: (eventId: string) => void;
  currentTime: number;
  toast: ReturnType<typeof useToast>['toast'];
}

export function ContentCard({
  item,
  isPreview = false,
  showSubmitButton = false,
  index = 0,
  onDelete,
  onFinalize,
  onOpenReels,
  currentTime,
  toast
}: ContentCardProps) {
  const colors = typeColors[item.type] || typeColors.event;
  const isCustomEvent = item.id.startsWith('custom-');

  // Check if event was created recently (within last 5 minutes)
  const isRecentlyCreated = useMemo(() => {
    if (!item.id.startsWith('custom-')) return false;
    const timestamp = parseInt(item.id.replace('custom-', ''));
    const fiveMinutesAgo = currentTime - (5 * 60 * 1000);
    return timestamp > fiveMinutesAgo;
  }, [item.id, currentTime]);

  // Dialog state management using useConfirmDialog hook
  const deleteDialog = useConfirmDialog(() => {
    onDelete(item.id);
  });

  const finalizeDialog = useConfirmDialog(() => {
    if (onFinalize) {
      const newEvent = onFinalize(item.id);
      if (newEvent) {
        toast.success('Event submitted for admin review!');
      } else {
        toast.error('Failed to submit event. Please try again.');
      }
    }
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenReels(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenReels(item.id);
        }
      }}
      aria-label={`Open details for ${item.title}`}
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
        focus:outline-none focus:ring-2 focus:ring-[#8268bc]/60 focus:ring-offset-2 focus:ring-offset-[#1a0f2e]
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* Header with Badges and Date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Preview Badge - for events NOT yet submitted */}
            {isPreview && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border-2 border-blue-500/30 shadow-md backdrop-blur-sm">
                PREVIEW
              </span>
            )}

            {/* New Badge - for recently created custom events */}
            {!isPreview && isRecentlyCreated && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 border-2 border-green-500/30 shadow-md backdrop-blur-sm">
                NEW
              </span>
            )}

            {/* Type Badge */}
            <span className={`
              text-xs font-bold px-4 py-2 rounded-lg
              ${colors.bg} ${colors.text}
              border-2 border-current/30
              shadow-md
              backdrop-blur-sm
            `}>
              {capitalize(item.type)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.date && (
              <span className="flex items-center gap-1.5 text-xs text-[#d4d4d4] font-bold bg-[#2a1f47]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#8268bc]/20" suppressHydrationWarning>
                <Calendar className="w-3 h-3" />
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {/* Removed Submit button from top-right - now in footer */}
            {(isCustomEvent || isPreview) && (
              <button
                onClick={deleteDialog.open}
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

          {/* Description with ellipsis indicator */}
          <div className="relative">
            <p className="text-[#d4d4d4] text-sm leading-relaxed line-clamp-3 group-hover:text-[#e0e0e0] transition-colors">
              {item.description}
            </p>
            {item.description.length > 150 && (
              <span className="text-gray-500 text-xs mt-1 inline-block">
                ... <span className="text-blue-400">more</span>
              </span>
            )}
          </div>

          {item.location && (
            <LocationButton
              eventId={item.id}
              coordinates={item.coordinates}
              location={item.location}
              variant="default"
            />
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

        {/* Card Footer - Submit Button */}
        {showSubmitButton && onFinalize && (
          <div className="mt-4">
            <button
              onClick={finalizeDialog.open}
              className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-[#2a1f47]/60 text-[#8268bc] hover:bg-[#8268bc]/20 transition-all border border-[#8268bc]/30 hover:border-[#8268bc]/60 hover:scale-[1.01]"
            >
              Submit Event
            </button>
          </div>
        )}
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deleteDialog.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteDialog.confirm}
        onCancel={deleteDialog.cancel}
      />

      <ConfirmDialog
        open={finalizeDialog.isOpen}
        title="Submit Event"
        message="Submit this event for admin review? Your event will appear on the feed if approved by an admin."
        confirmText="Submit"
        cancelText="Cancel"
        onConfirm={finalizeDialog.confirm}
        onCancel={finalizeDialog.cancel}
      />
    </div>
  );
}
