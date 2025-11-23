'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import NavBar from '@/components/NavBar';
import OnboardingInformation from '@/components/OnboardingInformation';
import ForYouFeed from '@/components/ForYouFeed';
import { UserProfile } from '@/types';

export default function ForYouPage() {
  // In a real app, this would come from AuthContext or Database
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Default to UW for this demo, but this could be dynamic based on login
  const defaultOrgId = 'uw-seattle';

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        {userProfile && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setUserProfile(null)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Reset Demo
            </button>
          </div>
        )}

        {!userProfile ? (
          <OnboardingInformation
            organizationId={defaultOrgId}
            onComplete={(profile) => setUserProfile(profile)}
          />
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900">Your Profile</h2>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Major: <strong className="text-gray-900">{userProfile.major}</strong></span>
                    <span>Year: <strong className="text-gray-900">{userProfile.year}</strong></span>
                    <span>Interests: <strong className="text-gray-900">{userProfile.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}</strong></span>
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

            <ForYouFeed user={userProfile} />
          </div>
        )}
      </div>
    </div>
  );
}
