'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Users, MapPin } from 'lucide-react';
import { ContentItem } from '@/types';
import { BouncingCardConfig, depthConfig } from './traversalPaths';
import { cn } from '@/lib/utils';

interface TraversingCardProps {
  event: ContentItem;
  config: BouncingCardConfig;
  reducedMotion?: boolean;
}

export function TraversingCard({
  event,
  config,
  reducedMotion = false,
}: TraversingCardProps) {
  const depth = depthConfig[config.depth];
  const baseWidth = 160;
  const baseHeight = 110;
  const cardWidth = baseWidth * depth.scale;
  const cardHeight = baseHeight * depth.scale;

  // Track viewport size for boundary calculations
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Motion values for position (in pixels)
  const x = useMotionValue((config.initialX / 100) * viewport.width);
  const y = useMotionValue((config.initialY / 100) * viewport.height);

  // Velocity ref (mutable, doesn't trigger re-renders)
  // Velocity is in percentage points per second, converted to pixels
  const velocityRef = useRef({
    vx: config.velocityX,
    vy: config.velocityY,
  });

  // Padding from edges (in pixels)
  const padding = 20;

  // Physics-based animation loop
  useAnimationFrame((_, delta) => {
    if (reducedMotion || viewport.width === 0) return;

    const vx = velocityRef.current.vx;
    const vy = velocityRef.current.vy;

    // Convert percentage velocity to pixel velocity
    const pxVelocityX = (vx / 100) * viewport.width;
    const pxVelocityY = (vy / 100) * viewport.height;

    // Calculate new position (delta is in ms, normalize to seconds)
    const deltaSeconds = delta / 1000;
    let newX = x.get() + pxVelocityX * deltaSeconds;
    let newY = y.get() + pxVelocityY * deltaSeconds;

    // Calculate bounds
    const minX = padding;
    const maxX = viewport.width - cardWidth - padding;
    const minY = padding;
    const maxY = viewport.height - cardHeight - padding;

    // Bounce off left/right edges
    if (newX <= minX) {
      velocityRef.current.vx = Math.abs(vx);
      newX = minX;
    } else if (newX >= maxX) {
      velocityRef.current.vx = -Math.abs(vx);
      newX = maxX;
    }

    // Bounce off top/bottom edges
    if (newY <= minY) {
      velocityRef.current.vy = Math.abs(vy);
      newY = minY;
    } else if (newY >= maxY) {
      velocityRef.current.vy = -Math.abs(vy);
      newY = maxY;
    }

    x.set(newX);
    y.set(newY);
  });

  // Update position when viewport changes
  useEffect(() => {
    if (viewport.width > 0) {
      x.set((config.initialX / 100) * viewport.width);
      y.set((config.initialY / 100) * viewport.height);
    }
  }, [viewport.width, viewport.height, config.initialX, config.initialY, x, y]);

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
          width: cardWidth,
          height: cardHeight,
          opacity: depth.opacity,
          zIndex: depth.zIndex,
          left: `${config.initialX}%`,
          top: `${config.initialY}%`,
        }}
        aria-hidden="true"
      >
        <CardContent event={event} />
      </div>
    );
  }

  // Don't render until viewport is measured
  if (viewport.width === 0) {
    return null;
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
        width: cardWidth,
        height: cardHeight,
        opacity: depth.opacity,
        zIndex: depth.zIndex,
        left: x,
        top: y,
        willChange: 'left, top',
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
