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
      <div className="min-h-screen bg-[#0f0a1a]">
        <NavBar />
        <div className="max-w-4xl mx-auto p-8 text-center text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a0f2e] via-[#0f0a1a] to-[#1e1528]">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Display reset button only if the profile exists */}
        {profile && (
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={clearProfile}
              className='text-xs sm:text-sm text-[#a3a3a3] hover:text-[#8268bc] transition-all px-4 py-2 rounded-lg hover:bg-[#362955] border border-transparent hover:border-[#8268bc]/30'
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
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Profile Card with Campus Map Button - UW Themed */}
            <div className="bg-[#1e1432]/95 backdrop-blur-sm p-6 sm:p-7 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(107,78,168,0.2)] border border-[#362955] relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#8268bc]/10 to-transparent rounded-full blur-3xl"></div>

              <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-linear-to-b from-[#8268bc] to-[#d4c79f] rounded-full"></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5]">Your Profile</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#a3a3a3]">Major:</span>
                      <span className="font-semibold text-[#8268bc] bg-[#362955] px-3 py-1 rounded-lg">{profile.major}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#a3a3a3]">Year:</span>
                      <span className="font-semibold text-[#8268bc] bg-[#362955] px-3 py-1 rounded-lg">{profile.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#a3a3a3]">Interests:</span>
                      <span className="font-semibold text-[#d4c79f] bg-[#2a1f1a] px-3 py-1 rounded-lg">{profile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/experiments/map"
                  className="flex items-center justify-center sm:justify-start gap-2 bg-linear-to-r from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 shrink-0 font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Campus Map</span>
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

