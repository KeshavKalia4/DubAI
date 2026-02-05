'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, MapPin, FileText, Tag, Image, Send, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { eventsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { BackendEvent } from '@/types';

interface EventWithCounts extends BackendEvent {
  going_count?: number;
  interested_count?: number;
}

export default function ContributorDashboard() {
  const { netid, contributorStatus } = useAuth();
  const [events, setEvents] = useState<EventWithCounts[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);

  // Get the RSO name and ID from the approved request
  const approvedRequest = contributorStatus?.requests?.find(r => r.status === 'approved');
  const rsoName = approvedRequest?.rso_name || 'Your Organization';
  const rsoId = approvedRequest?.rso_id || netid;

  // Function to fetch events
  const fetchEvents = async () => {
    if (!rsoId) return;

    try {
      const rsoEvents = await eventsApi.getByRso(rsoId);
      setEvents(rsoEvents);
    } catch (error) {
      console.error('Failed to fetch RSO events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch events for this RSO on mount
  useEffect(() => {
    fetchEvents();
  }, [rsoId]);

  // Get current date/time in the format required for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    dateTime: getCurrentDateTime(),
    location: '',
    imageUrl: '',
    tags: '',
    eventLink: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!netid) return;

    // Validate date is not in the past
    if (formData.dateTime) {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate < now) {
        setError('Event date cannot be in the past');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    // Parse tags from comma-separated string
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    try {
      await eventsApi.create({
        rso_id: approvedRequest?.rso_id || netid, // Use RSO ID if available, otherwise user netid
        title: formData.eventName,
        description: formData.description,
        date_time: formData.dateTime,
        location: formData.location,
        tags: tagsArray,
      });

      setSubmitSuccess(true);

      // Refresh events list
      await fetchEvents();

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          eventName: '',
          description: '',
          dateTime: getCurrentDateTime(),
          location: '',
          imageUrl: '',
          tags: '',
          eventLink: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Verified Badge */}
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-2 border-green-500/40 rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_30px_rgba(34,197,94,0.2)]">
        <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#f5f5f5]">Verified Contributor</h2>
          <p className="text-green-200/80 text-sm">
            You can submit events for <span className="font-medium text-green-300">{rsoName}</span>
          </p>
        </div>
      </div>

      {/* Your Events Section */}
      <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f5f5f5]">Your Events</h2>
          <span className="text-sm text-[#a3a3a3]">{events.length} event{events.length !== 1 ? 's' : ''}</span>
        </div>

        {loadingEvents ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#8268bc]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-[#8268bc]/50 mx-auto mb-3" />
            <p className="text-[#a3a3a3]">No events yet. Create your first event below!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(showAllEvents ? events : events.slice(0, 3)).map((event) => {
              const eventDate = new Date(event.date_time);
              const isPast = eventDate < new Date();

              return (
                <div
                  key={event.id}
                  className={`bg-[#1a1025]/80 rounded-xl p-4 border ${isPast ? 'border-[#8268bc]/10 opacity-60' : 'border-[#8268bc]/20'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#f5f5f5] truncate">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-[#a3a3a3]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#8268bc]" />
                          <span>
                            {eventDate.toLocaleDateString('en-US', {
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
                            <span className="truncate max-w-[150px]">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1 text-green-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{event.going_count || 0} going</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">{event.interested_count || 0} interested</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {events.length > 3 && (
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="w-full py-2 text-sm text-[#8268bc] hover:text-[#a58fd8] flex items-center justify-center gap-1 transition-colors"
              >
                {showAllEvents ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show all {events.length} events
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Event Submission Form */}
      <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
        <h2 className="text-xl font-bold text-[#f5f5f5] mb-6">Submit a New Event</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {submitSuccess ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#f5f5f5] mb-2">Event Submitted!</h2>
            <p className="text-[#a3a3a3]">Your event is now live in the feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <FileText className="w-4 h-4 text-[#8268bc]" />
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
                placeholder="e.g., Spring Tech Mixer"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <FileText className="w-4 h-4 text-[#8268bc]" />
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all resize-none"
                placeholder="Tell students what your event is about..."
              />
            </div>

            {/* Date & Time */}
            <div>
              <label htmlFor="dateTime" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <Calendar className="w-4 h-4 text-[#8268bc]" />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleChange}
                min={getCurrentDateTime()}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <MapPin className="w-4 h-4 text-[#8268bc]" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
                placeholder="e.g., HUB 250, Mary Gates Hall 201"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <Image className="w-4 h-4 text-[#8268bc]" />
                Image URL <span className="text-[#a3a3a3] font-normal">(optional)</span>
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
                <Tag className="w-4 h-4 text-[#8268bc]" />
                Tags <span className="text-[#a3a3a3] font-normal">(comma-separated, optional)</span>
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
                placeholder="tech, networking, social, career"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_8px_30px_rgba(107,78,168,0.4)] hover:shadow-[0_12px_40px_rgba(107,78,168,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 border border-purple-500/50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Event
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
