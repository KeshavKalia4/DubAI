'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const REDIRECT_URL_KEY = 'authRedirectUrl';

export default function AuthCompletePage() {
  const router = useRouter();
  const { user, isLoading, isContributor, contributorStatus } = useAuth();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const storedRedirectRef = useRef<string | null>(null);

  // Read localStorage once on mount
  useEffect(() => {
    storedRedirectRef.current = localStorage.getItem(REDIRECT_URL_KEY);
    localStorage.removeItem(REDIRECT_URL_KEY);
    setHasCheckedStorage(true);
  }, []);

  useEffect(() => {
    // Wait for initial auth loading and localStorage check
    if (isLoading || !hasCheckedStorage) return;

    // If there's a stored redirect, use it immediately (no need to wait for contributor status)
    if (storedRedirectRef.current) {
      router.replace(storedRedirectRef.current);
      return;
    }

    // No stored redirect - need to determine based on user type
    // Wait for contributor status to be loaded (user exists but contributorStatus is still null)
    if (user && contributorStatus === null) {
      return;
    }

    // Determine where to redirect based on contributor status
    let redirectTo: string;

    if (isContributor || contributorStatus?.pending_request) {
      redirectTo = '/contribute';
    } else {
      redirectTo = '/explore';
    }

    router.replace(redirectTo);
  }, [router, user, isLoading, isContributor, contributorStatus, hasCheckedStorage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1025]">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-purple-500 mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-purple-200">Completing sign in...</p>
      </div>
    </div>
  );
}
