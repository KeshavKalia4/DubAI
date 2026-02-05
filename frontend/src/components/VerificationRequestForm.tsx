'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, Link as LinkIcon, Send, User } from 'lucide-react';
import { contributorApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationRequestFormProps {
  onSuccess?: () => void;
}

export default function VerificationRequestForm({ onSuccess }: VerificationRequestFormProps) {
  const router = useRouter();
  const { netid, user, refreshContributorStatus } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const [formData, setFormData] = useState({
    rsoName: '',
    reason: '',
    proof: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!netid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await contributorApi.createRequest({
        user_netid: netid,
        rso_name: formData.rsoName,
        reason: formData.reason,
        proof: formData.proof || undefined,
      });

      // Refresh contributor status to show pending request
      await refreshContributorStatus();
      onSuccess?.();

      // Redirect to landing page after successful submission
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#f5f5f5] mb-2">
          Become a Contributor
        </h2>
        <p className="text-[#a3a3a3]">
          Verify your affiliation with an RSO to submit events
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Your Name (read-only, from account) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
            <User className="w-4 h-4 text-[#8268bc]" />
            Your Name
          </label>
          <div className="w-full px-4 py-3 rounded-xl bg-[#1a1025]/80 border border-[#8268bc]/20 text-[#d4d4d4]">
            {userName}
          </div>
          <p className="mt-1 text-xs text-[#a3a3a3]">From your Google account</p>
        </div>

        {/* Organization Name */}
        <div>
          <label htmlFor="rsoName" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
            <Users className="w-4 h-4 text-[#8268bc]" />
            Organization Name *
          </label>
          <input
            type="text"
            id="rsoName"
            name="rsoName"
            required
            value={formData.rsoName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
            placeholder="e.g., WINFO, ACM, etc."
          />
        </div>

        {/* Role / Reason */}
        <div>
          <label htmlFor="reason" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
            <FileText className="w-4 h-4 text-[#8268bc]" />
            Your Role / Why you should be verified *
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all resize-none"
            placeholder="Describe your role in the organization (e.g., President, Events Chair, Member since 2023)"
          />
        </div>

        {/* Proof URL */}
        <div>
          <label htmlFor="proof" className="flex items-center gap-2 text-sm font-medium text-[#d4d4d4] mb-2">
            <LinkIcon className="w-4 h-4 text-[#8268bc]" />
            Proof URL <span className="text-[#a3a3a3] font-normal">(optional)</span>
          </label>
          <input
            type="url"
            id="proof"
            name="proof"
            value={formData.proof}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1025] border border-[#8268bc]/30 text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#8268bc] focus:border-transparent transition-all"
            placeholder="Link to your profile on org website, LinkedIn, etc."
          />
          <p className="mt-2 text-xs text-[#a3a3a3]">
            Providing proof helps speed up the verification process
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_8px_30px_rgba(107,78,168,0.4)] hover:shadow-[0_12px_40px_rgba(107,78,168,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 border border-purple-500/50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Verification Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
