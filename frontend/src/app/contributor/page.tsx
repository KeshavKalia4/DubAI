'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Type, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { InterestGrid } from '@/components/ui/InterestGrid';
import { Alert } from '@/components/ui/Alert';
import { useEvents } from '@/hooks/useEvents';
import { ContentType, ContentItem } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { getCoordinates } from '@/data/locations';
import { useToast } from '@/hooks/useToast';
import { validateEventForm } from '@/utils/formValidation';

/**
 * Contributor Page
 *
 * Event creation form for approved contributors.
 * Matches the auth page theme and uses our UI components.
 */

// Content type options for the select dropdown
const TYPE_OPTIONS = [
  { value: 'event', label: 'Event' },
  { value: 'club', label: 'Club' },
  { value: 'announcement', label: 'Announcement' },
];

export default function ContributorPage() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const { profile } = useUserProfile();
  const { toast } = useToast();

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
    title: '',
    description: '',
    type: 'event' as ContentType,
    tags: [] as string[],
    date: getCurrentDateTime(),
    location: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    const validation = validateEventForm(formData, 'submit');
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the event
      addEvent({
        organizationId: profile?.organizationId || 'uw-seattle',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        location: formData.location || undefined,
        coordinates: getCoordinates(formData.location) || undefined,
      });

      // Show success toast
      toast.success('Event submitted for admin review!');

      // Clear the form
      setFormData({
        title: '',
        description: '',
        type: 'event' as ContentType,
        tags: [] as string[],
        date: getCurrentDateTime(),
        location: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // Validate form data
    const validation = validateEventForm(formData, 'preview');
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Create preview event object
    const previewEvent: ContentItem = {
      id: `preview-${Date.now()}`,
      organizationId: profile?.organizationId || 'uw-seattle',
      type: formData.type,
      title: formData.title,
      description: formData.description,
      tags: formData.tags,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
      location: formData.location || undefined,
      imageUrl: undefined, // No image for preview
      coordinates: getCoordinates(formData.location) || undefined,
    };

    // Save to sessionStorage
    sessionStorage.setItem('previewEvent', JSON.stringify(previewEvent));

    // Show toast and navigate directly to feed
    toast.info('Taking you to preview...');
    router.push('/feed');
  };


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent">
            Create Event
          </h1>
          <p className="text-[var(--text-secondary)]">
            Share an event with the UW community
          </p>
        </div>

        {/* Info Alert */}
        <Alert
          message="Your event will be reviewed by admins before appearing on the feed."
          variant="info"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <Input
            label="Title *"
            name="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Event title"
            leftIcon={<Type className="w-5 h-5" />}
          />

          {/* Description */}
          <TextArea
            label="Description *"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your event..."
            rows={4}
          />

          {/* Type */}
          <Select
            label="Type *"
            name="type"
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, type: e.target.value as ContentType }))
            }
            options={TYPE_OPTIONS}
          />

          {/* Tags */}
          <InterestGrid
            label="Tags *"
            selectedTags={formData.tags}
            onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
            hint="Select categories for your event"
            showCount={true}
          />

          {/* Date */}
          <Input
            label="Date & Time *"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            leftIcon={<Calendar className="w-5 h-5" />}
          />

          {/* Location */}
          <Input
            label="Location"
            name="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="HUB, Mary Gates Hall, etc."
            leftIcon={<MapPin className="w-5 h-5" />}
            hint="Optional"
          />

          {/* Error Message */}
          {error && <Alert message={error} variant="error" />}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="xl"
              className="flex-1"
              onClick={handlePreview}
              disabled={isSubmitting}
            >
              Preview on Feed
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Create Event
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
