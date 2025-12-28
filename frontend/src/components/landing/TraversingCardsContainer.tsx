'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TraversingCard } from './TraversingCard';
import { bouncingCardConfigs, mobileBouncingCardConfigs } from './traversalPaths';
import { ContentItem } from '@/types';

interface CardAssignment {
  config: (typeof bouncingCardConfigs)[number];
  event: ContentItem;
}

interface TraversingCardsContainerProps {
  events: ContentItem[];
}

export function TraversingCardsContainer({ events }: TraversingCardsContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [cardAssignments, setCardAssignments] = useState<CardAssignment[]>([]);
  const [mounted, setMounted] = useState(false);

  // Check viewport size and initialize on mount (client-only)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shuffle events on client only to avoid hydration mismatch
  useEffect(() => {
    if (!mounted) return;

    const activeConfigs = isMobile ? mobileBouncingCardConfigs : bouncingCardConfigs;
    const eventsWithImages = events.filter((e) => e.imageUrl);
    const shuffled = [...eventsWithImages].sort(() => Math.random() - 0.5);

    const assignments = activeConfigs.map((config, index) => ({
      config,
      event: shuffled[index % shuffled.length],
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCardAssignments(assignments);
  }, [events, isMobile, mounted]);

  // Don't render until mounted (prevents hydration mismatch)
  // Also hide for reduced motion preference
  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {cardAssignments.map(({ config, event }) => (
        <TraversingCard
          key={config.id}
          event={event}
          config={config}
          reducedMotion={prefersReducedMotion ?? false}
        />
      ))}
    </div>
  );
}
