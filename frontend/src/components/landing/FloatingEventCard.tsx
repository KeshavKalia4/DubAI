'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Calendar } from 'lucide-react';
import { ContentItem } from '@/types';
import { cn } from '@/lib/utils';

interface FloatingEventCardProps {
  event: ContentItem;
  position: { x: number; y: number };
  delay: number;
  size?: 'sm' | 'md';
  reducedMotion?: boolean;
}

export function FloatingEventCard({
  event,
  position,
  delay,
  size = 'md',
  reducedMotion = false,
}: FloatingEventCardProps) {
  const dimensions = {
    sm: { width: 140, height: 100 },
    md: { width: 180, height: 130 },
  };

  const { width, height } = dimensions[size];

  // Natural floating animation with varied, organic movement
  // Different patterns for each card based on delay index
  const patterns = [
    { x: [0, 25, -15, 30, -20, 10, 0], y: [0, -20, 25, -10, 30, -25, 0] },
    { x: [0, -30, 20, -10, 35, -25, 0], y: [0, 15, -25, 20, -30, 10, 0] },
    { x: [0, 20, -25, 35, -15, 25, 0], y: [0, -30, 15, -20, 25, -10, 0] },
    { x: [0, -20, 30, -25, 15, -30, 0], y: [0, 25, -15, 30, -20, 15, 0] },
    { x: [0, 30, -20, 25, -30, 20, 0], y: [0, -25, 20, -30, 15, -20, 0] },
    { x: [0, -25, 35, -15, 25, -20, 0], y: [0, 20, -30, 25, -15, 30, 0] },
  ];

  const patternIndex = Math.floor(delay / 0.4) % patterns.length;
  const pattern = patterns[patternIndex];

  const driftAnimation = reducedMotion
    ? {}
    : {
        x: pattern.x,
        y: pattern.y,
        rotate: [0, 3, -2, 4, -3, 2, 0],
      };

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none select-none',
        'rounded-xl overflow-hidden',
        'backdrop-blur-md',
        'border border-white/10',
        'shadow-xl shadow-purple-900/20'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width,
        height,
        willChange: 'transform',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 0.55,
        scale: 1,
        ...driftAnimation,
      }}
      transition={{
        opacity: { duration: 1.5, delay },
        scale: { duration: 1.2, delay },
        x: {
          duration: 12 + delay * 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay,
        },
        y: {
          duration: 14 + delay * 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay + 0.5,
        },
        rotate: {
          duration: 16 + delay,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay + 1,
        },
      }}
    >
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="200px"
            className="object-cover blur-[2px] scale-110"
            loading="lazy"
          />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[var(--background)]/60" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-3 h-full flex flex-col justify-end">
        <h3 className="text-xs font-semibold text-white/90 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {event.attendees && (
            <div className="flex items-center gap-1 text-[10px] text-[var(--uw-gold)]">
              <Users className="w-3 h-3" />
              <span>{event.attendees.count}</span>
            </div>
          )}
          {event.date && (
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Glassmorphism Border Effect */}
      <div className="absolute inset-0 rounded-xl border border-white/10" />
    </motion.div>
  );
}
