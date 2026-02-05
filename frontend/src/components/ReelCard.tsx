'use client';
// Flash card v3 - vertical card with horizontal swipe
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, ExternalLink, Check, Star } from 'lucide-react';
import { ContentItem, RsvpStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRsvp } from '@/hooks/useRsvp';

interface ReelCardProps {
  event: ContentItem;
  index: number;
  isActive?: boolean;
}

const ReelCard: React.FC<ReelCardProps> = ({ event, index }) => {
  const router = useRouter();
  const { netid, user, setPendingAction } = useAuth();
  const { getRsvpStatus, setRsvp, getRsvpSummary, isRsvpLoading, loadEventRsvp } = useRsvp({ userNetid: netid || undefined });

  // Load RSVP status when card mounts or netid changes
  useEffect(() => {
    if (event.id) {
      loadEventRsvp(event.id);
    }
  }, [event.id, netid, loadEventRsvp]);

  const currentStatus = getRsvpStatus(event.id);
  const summary = getRsvpSummary(event.id, event.attendees?.count);
  const isLoading = isRsvpLoading(event.id);

  // Handle RSVP button click
  const handleRsvp = async (status: 'going' | 'interested') => {
    // If not logged in, store pending action and redirect to login
    if (!user) {
      setPendingAction({
        type: 'rsvp',
        eventId: event.id,
        status: status,
      });
      router.push('/login?redirect=/explore');
      return;
    }

    // Toggle off if already selected
    const newStatus: RsvpStatus = currentStatus === status ? null : status;
    try {
      await setRsvp(event.id, newStatus);
    } catch (error) {
      console.error('Failed to update RSVP:', error);
    }
  };

  // Format date
  const formatDate = () => {
    if (!event.date) return null;
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
      timeStr = ` · ${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
    return `${months[month - 1]} ${day}${timeStr}`;
  };

  return (
    <div className="h-full w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
      {/* Image Section */}
      <div className="relative h-56 sm:h-64 flex-shrink-0">
        <Image
          src={event.imageUrl || '/placeholder.svg'}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          priority={index === 0}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tags overlay */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
          {event.title}
        </h2>

        {/* Description */}
        <p className="text-base text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          {event.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-sm truncate">{event.location}</span>
            </div>
          )}
          {event.date && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-sm">{formatDate()}</span>
            </div>
          )}
          {(summary.going > 0 || summary.interested > 0) && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium">
                {summary.going > 0 && `${summary.going} going`}
                {summary.going > 0 && summary.interested > 0 && ' · '}
                {summary.interested > 0 && `${summary.interested} interested`}
              </span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          {/* RSVP Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleRsvp('going')}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                currentStatus === 'going'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="w-4 h-4" />
              {currentStatus === 'going' ? 'Going!' : 'Going'}
            </button>
            <button
              onClick={() => handleRsvp('interested')}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                currentStatus === 'interested'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Star className="w-4 h-4" />
              {currentStatus === 'interested' ? 'Interested!' : 'Interested'}
            </button>
          </div>

          {/* View Event Link */}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl font-bold text-base bg-purple-600 text-white text-center hover:bg-purple-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-center gap-1.5">
                <ExternalLink className="w-4 h-4" />
                <span>View Event</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
