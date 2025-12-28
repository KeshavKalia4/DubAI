'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, MapPin } from 'lucide-react';
import { ContentItem } from '@/types';
import { TraversalPath, depthConfig } from './traversalPaths';
import { cn } from '@/lib/utils';

interface TraversingCardProps {
  event: ContentItem;
  path: TraversalPath;
  reducedMotion?: boolean;
}

export function TraversingCard({
  event,
  path,
  reducedMotion = false,
}: TraversingCardProps) {
  const depth = depthConfig[path.depth];
  const baseWidth = 160;
  const baseHeight = 110;

  // Static position for reduced motion
  if (reducedMotion) {
    return (
      <div
        className={cn(
          'fixed pointer-events-none select-none',
          'rounded-xl overflow-hidden',
          'backdrop-blur-md',
          'border border-white/10',
          'shadow-xl shadow-purple-900/20'
        )}
        style={{
          width: baseWidth * depth.scale,
          height: baseHeight * depth.scale,
          opacity: depth.opacity,
          zIndex: depth.zIndex,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        <CardContent event={event} />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'fixed pointer-events-none select-none',
        'rounded-xl overflow-hidden',
        'backdrop-blur-md',
        'border border-white/10',
        'shadow-xl shadow-purple-900/20'
      )}
      style={{
        width: baseWidth * depth.scale,
        height: baseHeight * depth.scale,
        zIndex: depth.zIndex,
        willChange: 'transform',
      }}
      initial={{
        x: path.x[0],
        y: path.y[0],
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        x: path.x,
        y: path.y,
        opacity: depth.opacity,
        rotate: [0, 3, -2, 4, -3, 2, 0],
      }}
      transition={{
        x: {
          duration: path.duration,
          repeat: Infinity,
          ease: path.ease,
          delay: path.delay,
        },
        y: {
          duration: path.duration,
          repeat: Infinity,
          ease: path.ease,
          delay: path.delay,
        },
        opacity: {
          duration: 2,
          delay: path.delay,
        },
        rotate: {
          duration: path.duration * 0.7,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: path.delay,
        },
      }}
      aria-hidden="true"
    >
      <CardContent event={event} />
    </motion.div>
  );
}

// Extracted card content for reuse
function CardContent({ event }: { event: ContentItem }) {
  return (
    <>
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="180px"
            className="object-cover blur-[2px] scale-110"
            loading="lazy"
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[var(--background)]/70" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-2.5 h-full flex flex-col justify-end">
        <h3 className="text-[11px] font-semibold text-white/90 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {event.attendees && (
            <div className="flex items-center gap-0.5 text-[9px] text-[var(--uw-gold)]">
              <Users className="w-2.5 h-2.5" />
              <span>{event.attendees.count.toLocaleString()}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-0.5 text-[9px] text-white/60 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Glassmorphism border */}
      <div className="absolute inset-0 rounded-xl border border-white/10" />
    </>
  );
}
