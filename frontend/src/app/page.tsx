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
            <div className="bg-linear-to-br from-[#1e1432]/95 to-[#2a1f47]/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_8px_32px_rgba(107,78,168,0.3)] border-2 border-[#8268bc]/30 relative overflow-hidden hover:border-[#8268bc]/50 transition-all duration-300">
              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-linear-to-br from-[#8268bc]/20 to-[#d4c79f]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-linear-to-tr from-[#4B2E83]/15 to-transparent rounded-full blur-3xl"></div>

              <div className="relative">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#8268bc] via-[#9982d0] to-[#d4c79f] bg-clip-text text-transparent">
                    Your Profile
                  </h2>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  {/* Profile Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Major Card */}
                    <div className="bg-[#2a1f47]/60 backdrop-blur-sm border border-[#8268bc]/20 rounded-xl p-4 hover:border-[#8268bc]/40 transition-all duration-200">
                      <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2 font-semibold">Major</div>
                      <div className="text-base sm:text-lg font-bold text-[#8268bc]">{profile.major}</div>
                    </div>

                    {/* Year Card */}
                    <div className="bg-[#2a1f47]/60 backdrop-blur-sm border border-[#8268bc]/20 rounded-xl p-4 hover:border-[#8268bc]/40 transition-all duration-200">
                      <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2 font-semibold">Year</div>
                      <div className="text-base sm:text-lg font-bold text-[#9982d0]">{profile.year}</div>
                    </div>

                    {/* Interests Card */}
                    <div className="bg-[#2a1f47]/60 backdrop-blur-sm border border-[#d4c79f]/20 rounded-xl p-4 hover:border-[#d4c79f]/40 transition-all duration-200 sm:col-span-2 lg:col-span-1">
                      <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2 font-semibold">Interests</div>
                      <div className="text-sm sm:text-base font-bold text-[#d4c79f] truncate">{profile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}</div>
                    </div>
                  </div>

                  {/* Campus Map Button */}
                  <Link
                    href="/experiments/map"
                    className="group flex items-center justify-center gap-3 bg-linear-to-r from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#8268bc]/40 hover:scale-105 transition-all duration-300 shrink-0 font-bold border-2 border-[#9982d0]/30"
                  >
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Campus Map</span>
                  </Link>
                </div>
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

