'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import VerificationRequestForm from '@/components/VerificationRequestForm';
import ContributorDashboard from '@/components/ContributorDashboard';

export default function ContributePage() {
  const router = useRouter();
  const { user, isLoading, isContributor, contributorStatus } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/contribute');
    }
  }, [isLoading, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1025] flex items-center justify-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="text-center relative z-10">
          <svg className="animate-spin h-10 w-10 text-[#8268bc] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[#d4d4d4]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Check if user has a pending request
  const pendingRequest = contributorStatus?.pending_request;

  // Render content based on user's contributor status
  const renderContent = () => {
    // Case 1: User is a verified contributor
    if (isContributor) {
      return <ContributorDashboard />;
    }

    // Case 2: User has a pending request
    if (pendingRequest) {
      return (
        <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-[#f5f5f5] mb-2">
              Verification Pending
            </h2>
            <p className="text-[#d4d4d4] mb-6">
              Your request to be verified for <span className="font-medium text-[#8268bc]">{pendingRequest.rso_name}</span> is being reviewed.
            </p>

            <div className="bg-[#1a1025]/80 rounded-xl p-4 text-left mb-6 border border-[#8268bc]/20">
              <h3 className="text-sm font-medium text-[#8268bc] mb-2">Your Request Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-[#d4d4d4]">
                  <span className="text-[#a3a3a3]">Organization:</span> {pendingRequest.rso_name}
                </p>
                <p className="text-[#d4d4d4]">
                  <span className="text-[#a3a3a3]">Reason:</span> {pendingRequest.reason}
                </p>
                {pendingRequest.proof && (
                  <p className="text-[#d4d4d4]">
                    <span className="text-[#a3a3a3]">Proof:</span>{' '}
                    <a href={pendingRequest.proof} target="_blank" rel="noopener noreferrer" className="text-[#8268bc] hover:underline">
                      View Link
                    </a>
                  </p>
                )}
                <p className="text-[#d4d4d4]">
                  <span className="text-[#a3a3a3]">Submitted:</span> {new Date(pendingRequest.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#a3a3a3]">
              We'll notify you once your request has been reviewed.
            </p>
          </div>
        </div>
      );
    }

    // Case 3: User is not a contributor and has no pending request
    return <VerificationRequestForm />;
  };

  return (
    <div className="min-h-screen bg-[#1a1025] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#6b4ea8]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-[#8268bc]/20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#d4d4d4] hover:text-[#f5f5f5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#d4d4d4] bg-clip-text text-transparent">
              {isContributor ? 'Contributor Dashboard' : 'Submit an Event'}
            </span>
          </h1>
          <p className="text-[#a3a3a3]">
            {isContributor
              ? 'Share your RSO\'s events with the UW community'
              : 'Verify your RSO affiliation to submit events'
            }
          </p>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
}
