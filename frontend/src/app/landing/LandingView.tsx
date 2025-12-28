'use client';

/**
 * LandingView Component
 * 
 * The interactive UI for the landing page.
 * Separated from page.tsx to isolate Client Component logic (animations, hooks).
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AnimatedGradientBlobs } from '@/components/landing/AnimatedGradientBlobs';
import { TraversingCardsContainer } from '@/components/landing/TraversingCardsContainer';
import { uwEvents } from '@/data/uwEvents';

export default function LandingView() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6 relative overflow-hidden">
      {/* Layer 1: Animated Gradient Blobs (z-0) */}
      <AnimatedGradientBlobs />

      {/* Layer 2: Traversing Event Cards (z-1 to z-3) */}
      <TraversingCardsContainer events={uwEvents} />

      {/* Layer 3: Main Content */}
      <div className="z-10 w-full max-w-md flex flex-col items-center space-y-12">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent">
            DubAI
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Discover the best of UW campus life.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="/auth?mode=user" className="w-full sm:w-auto" tabIndex={-1}>
            <Button
              variant="primary"
              size="xl"
              className="w-full min-w-[180px]"
            >
              Student
            </Button>
          </Link>

          <Link href="/auth?mode=contributor" className="w-full sm:w-auto" tabIndex={-1}>
            <Button
              variant="outline"
              size="xl"
              className="w-full min-w-[180px]"
            >
              Contributor
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 text-[var(--text-tertiary)] text-xs text-center z-10"
      >
        <p>© {new Date().getFullYear()} DubAI </p>
      </motion.div>
    </div>
  );
}
