'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import OnboardingInformation from '@/components/OnboardingInformation';
import ForYouFeed from '@/components/ForYouFeed';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';

export default function FeedPage() {
  const router = useRouter();
  const { auth, isLoaded: authLoaded } = useAuth();
  const { profile, setProfile, isLoaded: profileLoaded } = useUserProfile();
  const defaultOrgId = 'uw-seattle';

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (authLoaded && !auth.isAuth) {
      router.push('/');
    }
  }, [authLoaded, auth.isAuth, router]);

  // Wait for auth and profile to load before rendering content
  if (!authLoaded || !profileLoaded) {
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
          {/* Conditional: No profile -> onboarding, has profile -> feed */}
          {!profile ? (
            <OnboardingInformation
              organizationId={defaultOrgId}
              onComplete={(newProfile) => {
                // Merge auth data with profile
                const completeProfile = {
                  ...newProfile,
                  id: auth.id || newProfile.id,
                  email: auth.email || newProfile.email,
                };
                setProfile(completeProfile);
              }}
            />
          ) : (
            <ForYouFeed user={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
