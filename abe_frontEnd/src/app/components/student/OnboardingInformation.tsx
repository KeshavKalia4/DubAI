import React, { useState } from 'react';
import { getOrganizationById } from '@/config/organizations';
import { availableTags } from '@/data/mockData';
import { UserProfile } from '@/types';

interface OnboardingInformationProps {
  organizationId: string;
  onComplete: (profile: UserProfile) => void;
}

const OnboardingInformation: React.FC<OnboardingInformationProps> = ({
  organizationId,
  onComplete,
}) => {
  const org = getOrganizationById(organizationId);
  const [step, setStep] = useState(1);
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!org) return <div className="text-white/40">Organization not found</div>;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        id: crypto.randomUUID(),
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
    <div className="max-w-2xl mx-auto bg-[#0d0a1a]/90 border border-white/10 shadow-2xl shadow-black/50 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full border border-[#4b2e83]/50 bg-[#4b2e83]/20 flex items-center justify-center text-white font-bold text-xl">
            m
          </div>
          <h1 className="font-bold text-xl text-white/90 tracking-tight">madr</h1>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white/80 tracking-tight mb-2">
          Welcome to {org.name}
        </h2>
        <p className="text-white/35 text-sm sm:text-base">Let&apos;s personalize your experience.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`w-8 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#4b2e83]' : 'bg-white/10'}`} />
          <div className={`w-8 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#4b2e83]' : 'bg-white/10'}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-5 sm:space-y-6">
          <label className="block">
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block">Major</span>
            <select
              className="block w-full rounded-xl border border-white/10 focus:border-[#4b2e83]/50 focus:ring-1 focus:ring-[#4b2e83]/30 p-3 text-sm text-white/70 bg-white/5 transition-all outline-none"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            >
              <option value="" className="bg-[#0d0a1a]">Select a Major</option>
              {org.onboardingConfig.majors.map((m) => (
                <option key={m} value={m} className="bg-[#0d0a1a]">{m}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block">Year</span>
            <select
              className="block w-full rounded-xl border border-white/10 focus:border-[#4b2e83]/50 focus:ring-1 focus:ring-[#4b2e83]/30 p-3 text-sm text-white/70 bg-white/5 transition-all outline-none"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" className="bg-[#0d0a1a]">Select Year</option>
              {org.onboardingConfig.years.map((y) => (
                <option key={y} value={y} className="bg-[#0d0a1a]">{y}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 sm:space-y-5">
          <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] block">Interests</span>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`cursor-pointer px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-[#4b2e83]/40 text-white border-[#4b2e83]/60 shadow-md scale-105'
                    : 'bg-white/5 text-white/50 border-white/10 hover:border-[#4b2e83]/40 hover:bg-[#4b2e83]/10 hover:text-white/70'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 sm:mt-10 flex justify-between items-center">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="cursor-pointer text-sm text-white/30 hover:text-white/60 transition-colors font-mono text-xs uppercase tracking-[0.15em]"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleNext}
          disabled={step === 1 && (!major || !year)}
          className="cursor-pointer bg-[#4b2e83]/60 border border-[#4b2e83]/50 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:bg-[#4b2e83]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base"
        >
          {step === 2 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingInformation;
