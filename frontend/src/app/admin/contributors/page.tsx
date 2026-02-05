'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Clock, CheckCircle, XCircle, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { contributorApi } from '@/lib/api';
import type { ContributorRequest } from '@/lib/api';

type FilterStatus = 'pending' | 'approved' | 'denied' | 'all';

export default function AdminContributorsPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin, netid } = useAuth();
  const [requests, setRequests] = useState<ContributorRequest[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch requests based on filter
  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    setError(null);
    try {
      let data: ContributorRequest[];
      if (filter === 'pending') {
        data = await contributorApi.getPendingRequests(100);
      } else if (filter === 'all') {
        data = await contributorApi.getAllRequests(undefined, 100);
      } else {
        data = await contributorApi.getAllRequests(filter, 100);
      }
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Failed to load requests');
    } finally {
      setIsLoadingRequests(false);
    }
  }, [filter]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/admin/contributors');
    } else if (!isLoading && user && !isAdmin) {
      router.push('/');
    }
  }, [isLoading, user, isAdmin, router]);

  // Fetch requests when filter changes
  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [filter, isAdmin, fetchRequests]);

  // Handle approve action
  const handleApprove = async (requestId: string) => {
    if (!netid) return;
    setActionLoading(requestId);
    try {
      await contributorApi.approveRequest(requestId, {
        admin_netid: netid,
      });
      // Refresh requests
      await fetchRequests();
    } catch (err) {
      console.error('Failed to approve request:', err);
      setError('Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle deny action
  const handleDeny = async (requestId: string) => {
    if (!netid) return;
    setActionLoading(requestId);
    try {
      await contributorApi.denyRequest(requestId, {
        admin_netid: netid,
      });
      // Refresh requests
      await fetchRequests();
    } catch (err) {
      console.error('Failed to deny request:', err);
      setError('Failed to deny request');
    } finally {
      setActionLoading(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1025] via-[#2a1f47] to-[#1a1025] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-purple-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || !isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
            <XCircle className="w-3 h-3" />
            Denied
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1025] via-[#2a1f47] to-[#1a1025]">
      {/* Header */}
      <div className="border-b border-purple-500/20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Contributor Verification
          </h1>
          <p className="text-purple-200/70">
            Review and manage contributor verification requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['pending', 'approved', 'denied', 'all'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#2a1f47]/80 text-purple-300 hover:bg-purple-600/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Requests List */}
        {isLoadingRequests ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-purple-200">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-[#2a1f47]/50 rounded-2xl border border-purple-500/20">
            <Users className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
            <p className="text-purple-200/70">No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-[#2a1f47]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {request.rso_name}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-purple-300 mb-2">
                      Requested by: <span className="text-purple-200">{request.user_netid}</span>
                    </p>
                    <p className="text-sm text-purple-200/70 mb-3">
                      {request.reason}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-purple-300/60">
                      <span>
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      {request.proof && (
                        <a
                          href={request.proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Proof
                        </a>
                      )}
                      {request.reviewed_at && (
                        <span>
                          Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
                          {request.reviewed_by && ` by ${request.reviewed_by}`}
                        </span>
                      )}
                    </div>
                    {request.admin_notes && (
                      <p className="mt-2 text-sm text-purple-300/80 italic">
                        Admin notes: {request.admin_notes}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons (only for pending) */}
                  {request.status === 'pending' && (
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {actionLoading === request.id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeny(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {actionLoading === request.id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Deny
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
