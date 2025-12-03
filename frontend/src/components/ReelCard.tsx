'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, Share2, Check, Star, X as XIcon } from 'lucide-react';
import { ContentItem, RsvpStatus } from '@/types';
import { useRsvp } from '@/hooks/useRsvp';

interface ReelCardProps {
  event: ContentItem;
  index: number;
}

const ReelCard: React.FC<ReelCardProps> = ({ event, index }) => {
  const { getRsvpStatus, setRsvp, getRsvpSummary } = useRsvp();

  const currentStatus = getRsvpStatus(event.id);
  const summary = getRsvpSummary(event.id, event.attendees?.count);

  const handleRsvpClick = (status: RsvpStatus) => {
    const newStatus = currentStatus === status ? null : status;
    setRsvp(event.id, newStatus);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here
    }
  };

  const getRsvpButtonStyle = (buttonStatus: RsvpStatus) => {
    const isActive = currentStatus === buttonStatus;
    return `
      px-6 py-3 rounded-xl font-bold text-sm
      transition-all duration-200
      border-2
      hover:scale-105 active:scale-95
      ${isActive
        ? 'bg-[#8268bc] text-white border-[#8268bc] shadow-lg shadow-[#8268bc]/50'
        : 'bg-[#2a1f47]/80 backdrop-blur-sm text-[#8268bc] border-[#8268bc]/30 hover:border-[#8268bc]/60'
      }
    `;
  };

  return (
    <div
      className="
        relative w-full
        h-screen h-[100dvh]
        overflow-hidden
      "
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src={event.imageUrl || '/placeholder.jpg'}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(15, 10, 26, 0.4) 0%,
            rgba(15, 10, 26, 0.1) 30%,
            rgba(15, 10, 26, 0.8) 70%,
            rgba(15, 10, 26, 0.95) 100%
          )`
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-end p-4 sm:p-6 pb-8 sm:pb-12">
        {/* Event Info */}
        <div className="space-y-3 sm:space-y-4">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
            {event.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#d4d4d4] line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#d4d4d4]">
            {event.location && (
              <div className="flex items-center gap-1.5 bg-[#2a1f47]/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#8268bc]/20">
                <MapPin className="w-4 h-4 text-[#8268bc]" />
                <span className="font-medium">{event.location}</span>
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-1.5 bg-[#2a1f47]/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#8268bc]/20">
                <Calendar className="w-4 h-4 text-[#8268bc]" />
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Attendees Count */}
          <div className="flex items-center gap-2 text-[#d4d4d4]">
            <Users className="w-5 h-5 text-[#8268bc]" />
            <span className="font-semibold text-sm sm:text-base">
              {summary.going} attending
            </span>
            {summary.interested > 0 && (
              <span className="text-[#a3a3a3] text-sm">
                · {summary.interested} interested
              </span>
            )}
          </div>

          {/* RSVP Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
            <button
              onClick={() => handleRsvpClick('going')}
              className={getRsvpButtonStyle('going')}
            >
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Going</span>
              </div>
            </button>

            <button
              onClick={() => handleRsvpClick('interested')}
              className={getRsvpButtonStyle('interested')}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                <span>Interested</span>
              </div>
            </button>

            <button
              onClick={() => handleRsvpClick('not_going')}
              className={getRsvpButtonStyle('not_going')}
            >
              <div className="flex items-center justify-center gap-2">
                <XIcon className="w-4 h-4" />
                <span>Not Going</span>
              </div>
            </button>

            <button
              onClick={handleShare}
              className="
                px-6 py-3 rounded-xl font-bold text-sm
                bg-[#2a1f47]/80 backdrop-blur-sm text-[#d4c79f]
                border-2 border-[#d4c79f]/30
                hover:border-[#d4c79f]/60 hover:scale-105
                active:scale-95
                transition-all duration-200
              "
            >
              <div className="flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </div>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="
                  text-xs font-bold px-3 py-1.5 rounded-lg
                  bg-[#362955]/80 backdrop-blur-sm
                  text-[#8268bc] border border-[#8268bc]/30
                "
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
