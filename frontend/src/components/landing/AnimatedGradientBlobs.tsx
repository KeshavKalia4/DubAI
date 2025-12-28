'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AnimatedGradientBlobs() {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants for the purple blob (top-left)
  const purpleBlobAnimation = prefersReducedMotion
    ? {}
    : {
        scale: [1, 1.15, 0.95, 1.1, 1],
        x: [0, 30, -20, 10, 0],
        y: [0, 20, -15, 25, 0],
      };

  // Animation variants for the gold blob (bottom-right)
  const goldBlobAnimation = prefersReducedMotion
    ? {}
    : {
        scale: [1, 0.9, 1.2, 0.95, 1],
        x: [0, -25, 15, -10, 0],
        y: [0, -20, 30, -15, 0],
      };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Purple Blob - Top Left */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--uw-purple)] rounded-full blur-[120px] opacity-20"
        style={{ willChange: 'transform' }}
        animate={purpleBlobAnimation}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Purple Accent - subtle inner glow */}
      <motion.div
        className="absolute top-[5%] left-[5%] w-[30%] h-[30%] bg-[var(--uw-purple-light)] rounded-full blur-[80px] opacity-10"
        style={{ willChange: 'transform' }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Gold Blob - Bottom Right */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--uw-gold)] rounded-full blur-[120px] opacity-10"
        style={{ willChange: 'transform' }}
        animate={goldBlobAnimation}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

      {/* Secondary Gold Accent - subtle inner glow */}
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[25%] h-[25%] bg-[var(--uw-gold-light)] rounded-full blur-[60px] opacity-[0.08]"
        style={{ willChange: 'transform' }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.25, 1],
                opacity: [0.08, 0.12, 0.08],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 8,
        }}
      />
    </div>
  );
}
