'use client';

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
          <ForYouFeed user={profile} />
        )}
      </div>
    </div>
  );
}

