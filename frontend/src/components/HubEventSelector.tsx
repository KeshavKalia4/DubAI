'use client';

import React from 'react';
import Image from 'next/image';
import { X, Clock, MapPin, Users } from 'lucide-react';
import { LocationHub, ContentItem } from '@/types';
import { MAP_Z_INDEX } from '@/utils/mapZIndex';

interface HubEventSelectorProps {
  hub: LocationHub;
  onSelectEvent: (event: ContentItem) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function HubEventSelector({
  hub,
  onSelectEvent,
  onClose,
  theme
}: HubEventSelectorProps) {
  return (
    <div
      className="fixed bottom-0 md:bottom-4 left-0 right-0 md:left-auto md:right-4 w-full md:w-[400px] max-h-[70vh] overflow-y-auto bg-linear-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md rounded-t-3xl md:rounded-2xl shadow-[0_20px_60px_rgba(107,78,168,0.4)] border-2 border-[#8268bc]/30 animate-in slide-in-from-bottom-10 fade-in duration-300"
      style={{ zIndex: MAP_Z_INDEX.EVENT_CARD }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1e1432]/95 backdrop-blur-md border-b border-[#8268bc]/30 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#f5f5f5] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8268bc]" />
            {hub.location}
          </h3>
          <p className="text-xs text-[#d4d4d4]">
            {hub.count} {hub.count === 1 ? 'event' : 'events'} at this location
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#a3a3a3] hover:text-[#f5f5f5] rounded-full hover:bg-[#362955]/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Event List */}
      <div className="p-2">
        {hub.events.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="w-full p-3 rounded-xl bg-linear-to-br from-[#1e1432]/80 to-[#2a1f47]/60 hover:from-[#2a1f47]/90 hover:to-[#362955]/70 border-2 border-[#8268bc]/30 hover:border-[#8268bc]/60 shadow-[0_4px_15px_rgba(107,78,168,0.2)] hover:shadow-[0_8px_30px_rgba(107,78,168,0.35)] transition-all hover:scale-[1.02] text-left mb-2 group"
          >
            <div className="flex gap-3">
              {/* Event Image */}
              {event.imageUrl && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Event Info */}
              <div className="flex-1 min-w-0">
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg backdrop-blur-sm shadow-md border-2 ${
                      event.type === 'event'
                        ? 'bg-[#4B2E83]/20 text-[#8268bc] border-[#8268bc]/30'
                        : 'bg-[#B7A57A]/20 text-[#d4c79f] border-[#d4c79f]/30'
                    }`}
                  >
                    {event.type === 'event' ? 'Event' : 'Club'}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-sm text-[#f5f5f5] line-clamp-1 mb-1 group-hover:text-white transition-colors">
                  {event.title}
                </h4>

                {/* Date */}
                {event.date && (
                  <div className="flex items-center gap-1 text-xs text-[#d4d4d4] mb-1">
                    <Clock className="w-3 h-3 text-[#8268bc]" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                {/* Attendees */}
                {event.attendees && (
                  <div className="flex items-center gap-1 text-xs text-[#d4d4d4]">
                    <Users className="w-3 h-3 text-[#8268bc]" />
                    <span>{event.attendees.count} attending</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-xs text-[#d4d4d4] line-clamp-2 mt-2">
                {event.description}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
