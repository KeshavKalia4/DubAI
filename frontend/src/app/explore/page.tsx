'use client';

import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import OnboardingInformation from '@/components/OnboardingInformation';
import ForYouFeed from '@/components/ForYouFeed';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, eventsApi } from '@/lib/api';

export default function ExplorePage() {
  const { profile, setProfile, isLoaded, syncWithBackend } = useUserProfile();
  const { netid, isLoading: authLoading, executePendingAction, pendingAction } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const pendingActionExecuted = useRef(false);
  const defaultOrgId = 'uw-seattle';

  useEffect(() => {
    async function checkOnboarding() {
      // Wait for auth to finish loading
      if (authLoading) return;

      // If not logged in, skip onboarding check and show feed
      if (!netid) {
        setCheckingOnboarding(false);
        setNeedsOnboarding(false);
        return;
      }

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

  // Execute pending RSVP action after login
  useEffect(() => {
    async function handlePendingAction() {
      // Only execute once, when user is logged in and we have a pending action
      if (!netid || !pendingAction || pendingActionExecuted.current) return;

      pendingActionExecuted.current = true;

      try {
        const action = await executePendingAction();
        if (action && action.type === 'rsvp') {
          // Execute the RSVP
          if (action.status === 'going') {
            await eventsApi.rsvp(action.eventId, netid);
          } else if (action.status === 'interested') {
            await eventsApi.maybe(action.eventId, netid);
          }
          console.log(`Successfully executed pending RSVP: ${action.status} for event ${action.eventId}`);
        }
      } catch (error) {
        console.error('Failed to execute pending action:', error);
      }
    }

    handlePendingAction();
  }, [netid, pendingAction, executePendingAction]);

  if (authLoading || checkingOnboarding || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#1a1025]">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Loading skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="bg-purple-900/50 h-48 rounded-xl"></div>
            <div className="bg-purple-800/30 h-8 w-32 rounded"></div>
            <div className="bg-purple-800/30 h-[60vh] rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1025]">
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
            <ForYouFeed />
          )}
        </div>
      </div>
    </div>
  );
}
