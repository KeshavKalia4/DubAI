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

  useEffect(() => {
    async function checkOnboarding() {
      if (!netid || authLoading) return;

      try {
        const result = await userApi.exists(netid);
        if (result.exists && result.onboarded) {
          await syncWithBackend(netid);
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setNeedsOnboarding(!profile);
      } finally {
        setCheckingOnboarding(false);
      }
    }

    checkOnboarding();
  }, [netid, authLoading]);

  if (authLoading || checkingOnboarding || !isLoaded) {
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
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {needsOnboarding || !profile ? (
            <OnboardingInformation
              organizationId={defaultOrgId}
              onComplete={(newProfile) => {
                setProfile(newProfile);
                setNeedsOnboarding(false);
              }}
            />
          ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Card */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                <button
                  onClick={clearProfile}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Reset Profile"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Major</div>
                  <div className="text-lg font-semibold text-purple-600">{profile.major}</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year</div>
                  <div className="text-lg font-semibold text-purple-600">{profile.year}</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Interests</div>
                  <div className="text-sm font-semibold text-purple-600 truncate">
                    {profile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}
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
