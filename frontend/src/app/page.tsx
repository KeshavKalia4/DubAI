'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import NavBar from '@/components/NavBar';
import OnboardingInformation from '@/components/OnboardingInformation';
import ForYouFeed from '@/components/ForYouFeed';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function Home() {
  const { profile, setProfile, clearProfile, isLoaded } = useUserProfile();
  const defaultOrgId = 'uw-seattle';

  // Wait for localStorage to load before rendering content
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NavBar />
        <div className="max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Display reset button only if the profile exists */}
        {profile && (
          <div className="flex justify-end mb-6">
            <button
              onClick={clearProfile}
              className='text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors'
            >
              Reset Profile
            </button>
          </div>
        )}

        {/* Conditional: No profile -> onboarding, has profile -> feed */}
        {!profile ? (
          <OnboardingInformation
            organizationId={defaultOrgId}
            onComplete={(newProfile) => setProfile(newProfile)}
          />
        ) : (
          <div className="space-y-10">
            {/* Profile Card with Campus Map Button */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-700/50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Your Profile</h2>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <span>Major: <strong className="text-gray-900 dark:text-gray-200 font-medium">{profile.major}</strong></span>
                    <span>Year: <strong className="text-gray-900 dark:text-gray-200 font-medium">{profile.year}</strong></span>
                    <span>Interests: <strong className="text-gray-900 dark:text-gray-200 font-medium">{profile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}</strong></span>
                  </div>
                </div>
                <Link
                  href="/experiments/map"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Campus Map</span>
                </Link>
              </div>
            </div>

            {/* For You Feed */}
            <ForYouFeed user={profile} />
          </div>
        )}
      </div>
    </div>
  );
}

