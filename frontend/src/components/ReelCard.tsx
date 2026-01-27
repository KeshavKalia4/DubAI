'use client';
// Frosted glass UI - v2
import React, { useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, Share2, Check, Star, X as XIcon } from 'lucide-react';
import { ContentItem, RsvpStatus } from '@/types';
import { useRsvp } from '@/hooks/useRsvp';
import { useAuth } from '@/contexts/AuthContext';

interface ReelCardProps {
  event: ContentItem;
  index: number;
}

const ReelCard: React.FC<ReelCardProps> = ({ event, index }) => {
  const { netid } = useAuth();
  const { getRsvpStatus, setRsvp, getRsvpSummary, loadEventRsvp, isRsvpLoading } = useRsvp({
    userNetid: netid || undefined,
  });

  useEffect(() => {
    if (event.id && netid) {
      loadEventRsvp(event.id);
    }
  }, [event.id, netid, loadEventRsvp]);

  const currentStatus = getRsvpStatus(event.id);
  const summary = getRsvpSummary(event.id, event.attendees?.count);
  const isLoading = isRsvpLoading(event.id);

  const handleRsvpClick = async (status: RsvpStatus) => {
    const newStatus = currentStatus === status ? null : status;
    try {
      await setRsvp(event.id, newStatus);
      if (status === 'going' && newStatus === 'going' && event.link) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = event.link;
        } else {
          window.open(event.link, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (error) {
      console.error('RSVP failed:', error);
    }
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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getRsvpButtonStyle = (buttonStatus: RsvpStatus) => {
    const isActive = currentStatus === buttonStatus;
    const isButtonLoading = isLoading && currentStatus !== buttonStatus;

    if (isActive && buttonStatus === 'going') {
      return `px-6 py-3 rounded-xl font-semibold text-sm bg-green-500 text-white shadow-lg transition-all ${isButtonLoading ? 'opacity-50' : ''}`;
    }
    if (isActive) {
      return `px-6 py-3 rounded-xl font-semibold text-sm bg-white text-gray-800 shadow-lg transition-all ${isButtonLoading ? 'opacity-50' : ''}`;
    }
    return `px-6 py-3 rounded-xl font-semibold text-sm bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 transition-all ${isButtonLoading ? 'opacity-50' : ''}`;
  };

  return (
    <div
      className="relative w-full h-screen h-[100dvh] overflow-hidden"
      style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src={event.imageUrl || '/placeholder.svg'}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
          loading={index === 0 ? 'eager' : 'lazy'}
          unoptimized
        />
      </div>

      {/* Simple dark overlay for readability */}
      <div className="absolute inset-0 z-[2] bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-end p-4 sm:p-6 pb-8 sm:pb-12">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
            {event.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/90 line-clamp-2">
            {event.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {event.location && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="font-medium text-white text-sm">{event.location}</span>
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Calendar className="w-4 h-4 text-white" />
                <span className="font-medium text-white">
                  {(() => {
                    const dateStr = event.date.replace(' ', 'T');
                    const parts = dateStr.split('T');
                    const datePart = parts[0];
                    const timePart = parts[1]?.split('+')[0]?.split('-')[0];
                    const [, month, day] = datePart.split('-').map(Number);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    let timeStr = '';
                    if (timePart) {
                      const timeParts = timePart.split(':');
                      const hour = parseInt(timeParts[0], 10);
                      const minute = parseInt(timeParts[1], 10) || 0;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const hour12 = hour % 12 || 12;
                      timeStr = `, ${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                    }
                    return `${months[month - 1]} ${day}${timeStr}`;
                  })()}
                </span>
              </div>
            )}
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{summary.going} attending</span>
            {summary.interested > 0 && (
              <span className="text-white/70">· {summary.interested} interested</span>
            )}
          </div>

          {/* RSVP Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
            <button
              onClick={() => handleRsvpClick('going')}
              disabled={isLoading}
              className={getRsvpButtonStyle('going')}
            >
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Going</span>
              </div>
            </button>

            <button
              onClick={() => handleRsvpClick('interested')}
              disabled={isLoading}
              className={getRsvpButtonStyle('interested')}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                <span>Interested</span>
              </div>
            </button>

            <button
              onClick={() => handleRsvpClick('not_going')}
              disabled={isLoading}
              className={getRsvpButtonStyle('not_going')}
            >
              <div className="flex items-center justify-center gap-2">
                <XIcon className="w-4 h-4" />
                <span>Not Going</span>
              </div>
            </button>

            <button
              onClick={handleShare}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 transition-all"
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
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white"
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
