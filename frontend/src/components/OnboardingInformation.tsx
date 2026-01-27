'use client';

import React, { useState, useEffect } from 'react';
import { getOrganizationById } from '../config/organizations';
import { availableTags } from '../data/mockData';
import { UserProfile, TagSuggestion } from '../types';
import { tagsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface OnboardingInformationProps {
  organizationId: string;
  onComplete: (profile: UserProfile) => void;
}

const OnboardingInformation: React.FC<OnboardingInformationProps> = ({
  organizationId,
  onComplete,
}) => {
  const org = getOrganizationById(organizationId);
  const { netid, user } = useAuth();
  const { completeOnboarding } = useUserProfile();
  const [step, setStep] = useState(1);
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState(availableTags);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      setIsLoadingTags(true);
      try {
        const suggestions = await tagsApi.getSuggestions();
        if (suggestions.length > 0) {
          const formattedTags = suggestions.map((tag: TagSuggestion) => ({
            id: tag.name,
            label: tag.display_name || tag.name,
            category: tag.category as 'topic' | 'identity' | 'career' | 'major',
          }));
          setTags(formattedTags);
        }
      } catch (error) {
        console.error('Failed to fetch tag suggestions, using defaults:', error);
      } finally {
        setIsLoadingTags(false);
      }
    }
    fetchTags();
  }, []);

  if (!org) return <div>Organization not found</div>;

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (!netid || !user) {
        console.error('No user logged in');
        return;
      }

      setIsSubmitting(true);
      try {
        const profile = await completeOnboarding(
          netid,
          user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          user.email || '',
          major,
          year,
          selectedTags
        );
        onComplete(profile);
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        const localProfile: UserProfile = {
          id: netid,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          organizationId: org.id,
          major,
          year,
          tags: selectedTags,
        };
        onComplete(localProfile);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-purple-600 p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome to {org.name}</h2>
        <p className="text-white/80 text-base sm:text-lg">Let&apos;s personalize your experience.</p>
      </div>

      {step === 1 && (
        <div className="space-y-5 sm:space-y-6">
          <label className="block">
            <span className="text-white font-medium text-sm mb-2 block">What is your Major?</span>
            <select
              className="block w-full rounded-lg border border-purple-400 focus:border-white focus:ring-2 focus:ring-white/20 p-3 text-sm sm:text-base text-white bg-purple-500"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            >
              <option value="">Select a Major</option>
              {org.onboardingConfig.majors.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-white font-medium text-sm mb-2 block">What year are you?</span>
            <select
              className="block w-full rounded-lg border border-purple-400 focus:border-white focus:ring-2 focus:ring-white/20 p-3 text-sm sm:text-base text-white bg-purple-500"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {org.onboardingConfig.years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 sm:space-y-5">
          <span className="text-white font-medium text-sm block">What are you interested in?</span>
          {isLoadingTags ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                      isSelected
                        ? 'bg-white text-purple-600 border-white scale-105 shadow-lg'
                        : 'bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 sm:mt-10 flex justify-end">
        <button
          onClick={handleNext}
          disabled={(step === 1 && (!major || !year)) || isSubmitting}
          className="bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {isSubmitting ? 'Saving...' : step === 2 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingInformation;
