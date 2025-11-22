'use client';

import React, { useState } from 'react';
import { getOrganizationById } from '../config/organizations';
import { availableTags } from '../data/mockData';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  organizationId: string;
  onComplete: (profile: UserProfile) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  organizationId,
  onComplete,
}) => {
  const org = getOrganizationById(organizationId);
  const [step, setStep] = useState(1);
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!org) return <div>Organization not found</div>;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete
      const profile: UserProfile = {
        id: 'user-' + Date.now(),
        name: 'Demo User',
        email: 'demo@' + org.domains[0],
        organizationId: org.id,
        major,
        year,
        tags: selectedTags,
      };
      onComplete(profile);
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to {org.name}</h2>
        <p className="text-gray-500">Let's personalize your experience.</p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-900 font-medium">What is your Major?</span>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border text-gray-900 bg-white"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            >
              <option value="">Select a Major</option>
              {org.onboardingConfig.majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-900 font-medium">What year are you?</span>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border text-gray-900 bg-white"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {org.onboardingConfig.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <span className="text-gray-700 font-medium">What are you interested in?</span>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={step === 1 && (!major || !year)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {step === 2 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
