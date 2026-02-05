'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Star, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsApi } from '@/lib/api';
import type { BackendEvent } from '@/types';

interface EventWithStatus extends BackendEvent {
  user_status?: 'rsvp' | 'maybe';
}

export default function MyEventsPage() {
  const router = useRouter();
  const { user, netid, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'going' | 'interested'>('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/my-events');
    }
  }, [authLoading, user, router]);

  // Fetch user's events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!netid) return;

      try {
        const userEvents = await eventsApi.getUserRsvps(netid);
        setEvents(userEvents);
      } catch (error) {
        console.error('Failed to fetch user events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (netid) {
      fetchEvents();
    }
  }, [netid]);

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'going') return event.user_status === 'rsvp';
    if (activeTab === 'interested') return event.user_status === 'maybe';
    return true;
  });

  const goingCount = events.filter(e => e.user_status === 'rsvp').length;
  const interestedCount = events.filter(e => e.user_status === 'maybe').length;

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1025] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="text-center relative z-10">
          <svg className="animate-spin h-10 w-10 text-[#8268bc] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[#d4d4d4]">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1025] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#6b4ea8]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-[#8268bc]/20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-[#d4d4d4] hover:text-[#f5f5f5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#d4d4d4] bg-clip-text text-transparent">
              My Events
            </span>
          </h1>
          <p className="text-[#a3a3a3]">
            Events you're going to or interested in
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{goingCount}</span>
            </div>
            <p className="text-green-200/80 text-sm">Going</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-md border-2 border-yellow-500/30 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{interestedCount}</span>
            </div>
            <p className="text-yellow-200/80 text-sm">Interested</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All', count: events.length },
            { id: 'going', label: 'Going', count: goingCount },
            { id: 'interested', label: 'Interested', count: interestedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#2a1f47]/50 text-[#a3a3a3] hover:bg-[#2a1f47] hover:text-[#d4d4d4]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-8 text-center shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
              <CalendarCheck className="w-12 h-12 text-[#8268bc]/50 mx-auto mb-3" />
              <p className="text-[#a3a3a3] mb-4">
                {activeTab === 'all'
                  ? "You haven't marked any events yet"
                  : activeTab === 'going'
                  ? "You're not going to any events yet"
                  : "You haven't marked any events as interested"}
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const eventDate = new Date(event.date_time);
              const isPast = eventDate < new Date();

              return (
                <div
                  key={event.id}
                  className={`bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-5 shadow-[0_8px_30px_rgba(107,78,168,0.25)] ${
                    isPast ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {event.user_status === 'rsvp' ? (
                          <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
                            Going
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-400">
                            Interested
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2 py-0.5 bg-[#8268bc]/20 border border-[#8268bc]/30 rounded-full text-xs font-medium text-[#a3a3a3]">
                            Past
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#f5f5f5] text-lg mb-2">{event.title}</h3>
                      <p className="text-[#a3a3a3] text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#a3a3a3]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#8268bc]" />
                          <span>
                            {eventDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[#8268bc]" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#8268bc]/20">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#8268bc]/20 rounded-lg text-xs text-[#d4d4d4]"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs text-[#a3a3a3]">
                          +{event.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
