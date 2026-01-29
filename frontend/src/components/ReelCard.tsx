'use client';
// Flash card v3 - vertical card with horizontal swipe
import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { ContentItem } from '@/types';

interface ReelCardProps {
  event: ContentItem;
  index: number;
  isActive?: boolean;
}

const ReelCard: React.FC<ReelCardProps> = ({ event, index }) => {
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
          {event.attendees && event.attendees.count > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium">{event.attendees.count} attending</span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="mt-auto">
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
