import { Settings } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import OnboardingInformation from '@/app/components/student/OnboardingInformation';
import ForYouFeed from '@/app/components/student/ForYouFeed';
import { UserProfile } from '@/types';
import { FlowFieldBackground } from '@/components/ui/flow-field-background';

export function StudentHome() {
  const { profile, setProfile, clearProfile, isLoaded } = useUserProfile();

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  // Show nothing until localStorage loads to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#08060f] flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border border-[#4b2e83]/60 border-t-[#b7a57a] animate-spin" />
      </div>
    );
  }

  // Not onboarded yet
  if (!profile) {
    return (
      <div className="relative min-h-screen bg-[#08060f] flex items-center justify-center p-4">
        <FlowFieldBackground
          color="#4b2e83"
          particleCount={220}
          speed={1.0}
          trailOpacity={0.05}
        />
        <div className="relative z-10 w-full max-w-2xl">
          <OnboardingInformation
            organizationId="uw-seattle"
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>
    );
  }

  // Onboarded → show feed
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Profile bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#4b2e83]/50 bg-[#4b2e83]/20 flex items-center justify-center text-white font-bold text-sm">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">{profile.name}</p>
            <p className="text-xs text-white/30">
              {profile.major} · {profile.year}
            </p>
          </div>
        </div>
        <button
          onClick={clearProfile}
          className="flex cursor-pointer items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15"
          title="Reset profile / re-onboard"
        >
          <Settings size={13} />
          <span>Reset</span>
        </button>
      </div>

      <ForYouFeed user={profile} />
    </div>
  );
}
