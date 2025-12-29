'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User, GraduationCap, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { InterestGrid } from '@/components/ui/InterestGrid';
import { Alert } from '@/components/ui/Alert';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { getOrgFromEmail } from '@/lib/emailUtils';

/**
 * Settings Page
 *
 * Allows users to edit their profile settings:
 * - View email and organization (read-only)
 * - Edit name, major, year, interests
 * - Logout functionality
 */

// Year options for the select dropdown
const YEAR_OPTIONS = [
  { value: 'freshman', label: 'Freshman' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'other', label: 'Other' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { profile, setProfile, isLoaded } = useUserProfile();
  const { logout } = useAuth();

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setMajor(profile.major || '');
      setYear(profile.year || '');
      setTags(profile.tags || []);
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !profile) {
      router.push('/landing');
    }
  }, [isLoaded, profile, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate required fields
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSaving(true);

    try {
      // Update profile with new values
      if (profile) {
        setProfile({
          ...profile,
          name: name.trim(),
          major: major.trim() || undefined,
          year: year || undefined,
          tags: tags,
        });

        setSuccess(true);

        // Hide success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  // Show loading state
  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--uw-purple)] border-t-transparent" />
      </div>
    );
  }

  const organization = profile.email ? getOrgFromEmail(profile.email) : 'Unknown';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6"
      >
        <Link href="/feed">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Feed
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
            Profile Settings
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your account and preferences
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Email (Read-only) */}
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            disabled
            leftIcon={<Mail className="w-5 h-5" />}
            hint="Email cannot be changed"
          />

          {/* Organization (Read-only) */}
          <Input
            label="Organization"
            type="text"
            value={organization}
            disabled
            leftIcon={<GraduationCap className="w-5 h-5" />}
          />

          {/* Name */}
          <Input
            label="Full Name *"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            leftIcon={<User className="w-5 h-5" />}
          />

          {/* Major */}
          <Input
            label="Major"
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="e.g., Computer Science"
            leftIcon={<GraduationCap className="w-5 h-5" />}
            hint="Optional"
          />

          {/* Year */}
          <Select
            label="Year"
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={YEAR_OPTIONS}
          />

          {/* Interests/Tags */}
          <InterestGrid
            label="Interests"
            selectedTags={tags}
            onChange={(newTags) => setTags(newTags)}
            hint="Select topics you're interested in"
            showCount={true}
          />

          {/* Success Message */}
          {success && (
            <Alert
              message="Settings saved successfully!"
              variant="success"
            />
          )}

          {/* Error Message */}
          {error && <Alert message={error} variant="error" />}

          {/* Save Button */}
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full"
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </form>

        {/* Logout Button */}
        <div className="pt-4 border-t border-white/10">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            leftIcon={<LogOut className="w-5 h-5" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
