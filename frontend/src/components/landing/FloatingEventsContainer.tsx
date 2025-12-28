'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FloatingEventCard } from './FloatingEventCard';
import { ContentItem } from '@/types';

interface FloatingEventsContainerProps {
  events: ContentItem[];
}

// Desktop positions - 6 cards around perimeter, avoiding center CTAs
const DESKTOP_POSITIONS = [
  { x: 3, y: 10, size: 'md' as const },
  { x: 78, y: 8, size: 'sm' as const },
  { x: -5, y: 42, size: 'sm' as const },
  { x: 82, y: 48, size: 'md' as const },
  { x: 5, y: 75, size: 'sm' as const },
  { x: 72, y: 78, size: 'md' as const },
];

// Mobile positions - fewer cards, more spread out
const MOBILE_POSITIONS = [
  { x: -8, y: 12, size: 'sm' as const },
  { x: 75, y: 55, size: 'sm' as const },
  { x: 5, y: 82, size: 'sm' as const },
];

export function FloatingEventsContainer({ events }: FloatingEventsContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<ContentItem[]>([]);
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

    const withImages = events.filter((e) => e.imageUrl);
    const shuffled = [...withImages].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedEvents(shuffled.slice(0, 6));
  }, [events, mounted]);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  const positions = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;
  const displayCount = isMobile ? 3 : 6;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {selectedEvents.slice(0, displayCount).map((event, index) => (
        <FloatingEventCard
          key={event.id}
          event={event}
          position={{ x: positions[index].x, y: positions[index].y }}
          size={positions[index].size}
          delay={index * 0.4}
          reducedMotion={prefersReducedMotion ?? false}
        />
      ))}
    </div>
  );
}
