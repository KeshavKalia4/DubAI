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
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        {/* Display reset button only if the profile exists */}
        {profile && (
          <div className="flex justify-end mb-4">
            <button
              onClick={clearProfile}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
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
          <div className="space-y-8">
            {/* Profile Card with Campus Map Button */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900">Your Profile</h2>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Major: <strong className="text-gray-900">{profile.major}</strong></span>
                    <span>Year: <strong className="text-gray-900">{profile.year}</strong></span>
                    <span>Interests: <strong className="text-gray-900">{profile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}</strong></span>
                  </div>
                </div>
                <Link
                  href="/experiments/map"
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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

