'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { getOrganizationById } from '../config/organizations';
import { UserProfile } from '../types';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { InterestGrid } from '@/components/ui/InterestGrid';
import { Input } from '@/components/ui/Input';
import { Mail, User } from 'lucide-react';

interface OnboardingInformationProps {
  organizationId: string;
  onComplete: (profile: UserProfile) => void;
  initialName?: string;
  initialEmail?: string;
}

/**
 * StepProgress Component
 * Animated progress bar showing current step in onboarding
 */
const StepProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--uw-purple)] to-[var(--uw-purple-light)] rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

const OnboardingInformation: React.FC<OnboardingInformationProps> = ({
  organizationId,
  onComplete,
  initialName,
  initialEmail,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const org = getOrganizationById(organizationId);
  // Always start at step 1, pre-fill name/email if provided
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!org) return <div>Organization not found</div>;

  // Transition config respecting reduced motion preference
  const transitionConfig = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.3 };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        name,
        email,
        organizationId: org.id,
        major,
        year,
        tags: selectedTags,
      };
      onComplete(profile);
    }
  };

  // Convert organization config to SelectOption format
  const majorOptions: SelectOption[] = org.onboardingConfig.majors.map(m => ({
    value: m,
    label: m,
  }));

  const yearOptions: SelectOption[] = org.onboardingConfig.years.map(y => ({
    value: y,
    label: y,
  }));

  // Validation for proceeding to next step
  const canProceed = step === 1
    ? Boolean(name && email)
    : step === 2
    ? Boolean(major && year)
    : selectedTags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl"
    >
      {/* Header with Progress Indicator */}
      <div className="mb-8">
        <StepProgress currentStep={step} totalSteps={3} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent mb-2">
          Welcome to {org.name}
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">
          Let&apos;s personalize your experience
        </p>
      </div>

      {/* Step Content with Animations */}
      <div className="min-h-[320px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transitionConfig}
              className="space-y-6"
            >
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                leftIcon={<User className="w-5 h-5" />}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@uw.edu"
                leftIcon={<Mail className="w-5 h-5" />}
              />
            </motion.div>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transitionConfig}
              className="space-y-6"
            >
              <Select
                label="What is your Major?"
                options={majorOptions}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Select a Major"
              />

              <Select
                label="What year are you?"
                options={yearOptions}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Select Year"
              />
            </motion.div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transitionConfig}
            >
              <InterestGrid
                label="What are you interested in?"
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                hint="Select the topics you're most interested in to personalize your feed"
                showCount={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between">
        {/* Back Button (only show on step 2) */}
        {step > 1 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        )}

        <div className="flex-1" /> {/* Spacer */}

        {/* Next/Finish Button */}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canProceed}
          rightIcon={step < 3 ? <ArrowRight className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
        >
          {step === 3 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
};

export default OnboardingInformation;
