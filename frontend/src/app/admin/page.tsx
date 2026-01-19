'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { storage } from '@/lib/storage';
import type { ContributorRequest } from '@/types';

/**
 * Admin Page
 *
 * Manage contributor access requests.
 * Allows admins to approve or reject pending contributor requests.
 */

export default function AdminPage() {
  const [requests, setRequests] = useState<ContributorRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const CONTRIBUTOR_REQUESTS_KEY = 'dubai-contributor-requests';

  // Load contributor requests
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const savedRequests = await storage.get<ContributorRequest[]>(CONTRIBUTOR_REQUESTS_KEY);
      setRequests(savedRequests || []);
    } catch (err) {
      setError('Failed to load contributor requests');
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setError(null);
      setSuccess(null);

      const updatedRequests = requests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
            }
          : req
      );

      await storage.set(CONTRIBUTOR_REQUESTS_KEY, updatedRequests);
      setRequests(updatedRequests);
      setSuccess('Request approved successfully!');

      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to approve request');
      console.error(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setError(null);
      setSuccess(null);

      const updatedRequests = requests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'rejected' as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
            }
          : req
      );

      await storage.set(CONTRIBUTOR_REQUESTS_KEY, updatedRequests);
      setRequests(updatedRequests);
      setSuccess('Request rejected');

      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to reject request');
      console.error(err);
    }
  };

  // Sort requests: pending first, then by date
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--uw-purple)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--background)] p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto mb-6"
      >
        <Link href="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Feed
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent">
            Contributor Requests
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage contributor access requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
            <div className="text-sm text-[var(--text-secondary)]">Pending</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
            <div className="text-sm text-[var(--text-secondary)]">Approved</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{rejectedCount}</div>
            <div className="text-sm text-[var(--text-secondary)]">Rejected</div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && <Alert message={success} variant="success" />}
        {error && <Alert message={error} variant="error" />}

        {/* Requests List */}
        <div className="space-y-4">
          {sortedRequests.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-[var(--text-secondary)]">No contributor requests yet</p>
            </div>
          ) : (
            sortedRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/5 border rounded-xl p-6 space-y-4 ${
                  request.status === 'pending'
                    ? 'border-yellow-500/30'
                    : request.status === 'approved'
                    ? 'border-green-500/30'
                    : 'border-red-500/30'
                }`}
              >
                {/* Header with Status Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Name and Email */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white font-semibold text-lg">
                        <User className="w-5 h-5 text-[var(--uw-purple-light)]" />
                        {request.name}
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                        <Mail className="w-4 h-4" />
                        {request.email}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Reason:
                      </div>
                      <p className="text-white pl-6">{request.reason}</p>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap gap-4 text-xs text-[var(--text-tertiary)]">
                      <div>
                        Requested: {new Date(request.requestedAt).toLocaleString()}
                      </div>
                      {request.reviewedAt && (
                        <div>
                          Reviewed: {new Date(request.reviewedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Approved
                      </div>
                    )}
                    {request.status === 'rejected' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Rejected
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons (only for pending requests) */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-2 border-t border-white/10">
                    <Button
                      variant="primary"
                      size="md"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => handleApprove(request.id)}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      leftIcon={<XCircle className="w-4 h-4" />}
                      onClick={() => handleReject(request.id)}
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
