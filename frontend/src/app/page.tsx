'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import NavBar from '@/components/NavBar';
import OnboardingInformation from '@/components/OnboardingInformation';
import ForYouFeed from '@/components/ForYouFeed';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';

export default function Home() {
  const { profile, setProfile, clearProfile, isLoaded, syncWithBackend } = useUserProfile();
  const { netid, isLoading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const defaultOrgId = 'uw-seattle';

  // Check onboarding status from backend
  useEffect(() => {
    async function checkOnboarding() {
      if (!netid || authLoading) return;

      try {
        const result = await userApi.exists(netid);
        if (result.exists && result.onboarded) {
          // User is onboarded, sync profile from backend
          await syncWithBackend(netid);
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // Fall back to localStorage profile check
        setNeedsOnboarding(!profile);
      } finally {
        setCheckingOnboarding(false);
      }
    }

    checkOnboarding();
  }, [netid, authLoading]);

  // Wait for auth and onboarding check
  if (authLoading || checkingOnboarding || !isLoaded) {
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
    <div className="flex flex-col h-screen bg-linear-to-br from-[#1a0f2e] via-[#0f0a1a] to-[#1e1528]">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Conditional: Needs onboarding -> show onboarding, otherwise -> feed */}
          {needsOnboarding || !profile ? (
            <OnboardingInformation
              organizationId={defaultOrgId}
              onComplete={(newProfile) => {
                setProfile(newProfile);
                setNeedsOnboarding(false);
              }}
            />
          ) : (
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Profile Card with Campus Map Button - UW Themed */}
            <div className="bg-linear-to-br from-[#1e1432]/95 to-[#2a1f47]/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_8px_32px_rgba(107,78,168,0.3)] border-2 border-[#8268bc]/30 relative overflow-hidden hover:border-[#8268bc]/50 transition-all duration-300">
              <div className="relative">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent">
                    Your Profile
                  </h2>
                  <button
                    onClick={clearProfile}
                    className="group flex items-center justify-center h-10 w-10 rounded-xl bg-[#2a1f47]/60 hover:bg-[#362955] border border-[#8268bc]/20 hover:border-[#8268bc]/40 transition-all duration-200"
                    aria-label="Reset Profile"
                  >
                    <Settings className="w-5 h-5 text-[#8268bc] group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* For You Feed */}
            <ForYouFeed user={profile} />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

