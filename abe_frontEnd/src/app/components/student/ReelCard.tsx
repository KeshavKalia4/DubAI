import React from 'react';
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
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getRsvpButtonStyle = (buttonStatus: RsvpStatus) => {
    const isActive = currentStatus === buttonStatus;
    return `px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 hover:scale-105 active:scale-95 ${
      isActive
        ? 'bg-[#4b2e83] text-white border-[#4b2e83] shadow-lg shadow-[#4b2e83]/30'
        : 'bg-white/80 backdrop-blur-sm text-[#4b2e83] border-[#4b2e83]/30 hover:border-[#4b2e83]/60'
    }`;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-[1]">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000'}
          alt={event.title}
          className="w-full h-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.85) 100%)`
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-end p-4 sm:p-6 pb-8 sm:pb-12">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-white/80 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/80">
            {event.location && (
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                <MapPin className="w-4 h-4 text-[#b7a57a]" />
                <span className="font-medium text-white">{event.location}</span>
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                <Calendar className="w-4 h-4 text-[#b7a57a]" />
                <span className="font-medium text-white">
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

          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-5 h-5 text-[#b7a57a]" />
            <span className="font-semibold text-sm sm:text-base text-white">
              {summary.going} attending
            </span>
            {summary.interested > 0 && (
              <span className="text-white/60 text-sm">
                · {summary.interested} interested
              </span>
            )}
          </div>

          {/* RSVP Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
            <button onClick={() => handleRsvpClick('going')} className={getRsvpButtonStyle('going')}>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Going</span>
              </div>
            </button>

            <button onClick={() => handleRsvpClick('interested')} className={getRsvpButtonStyle('interested')}>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                <span>Interested</span>
              </div>
            </button>

            <button onClick={() => handleRsvpClick('not_going')} className={getRsvpButtonStyle('not_going')}>
              <div className="flex items-center justify-center gap-2">
                <XIcon className="w-4 h-4" />
                <span>Not Going</span>
              </div>
            </button>

            <button
              onClick={handleShare}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white/20 backdrop-blur-sm text-[#b7a57a] border-2 border-[#b7a57a]/40 hover:border-[#b7a57a]/70 hover:scale-105 active:scale-95 transition-all duration-200"
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
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
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
