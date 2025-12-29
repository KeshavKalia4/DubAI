'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Map as MapIcon } from 'lucide-react';
import { ContentItem } from '@/types';
import { cn } from '@/lib/utils';

interface MapButtonProps {
  event: ContentItem;
  variant?: 'compact' | 'full';
  className?: string;
}

export function MapButton({ event, variant = 'full', className }: MapButtonProps) {
  const router = useRouter();

  // Don't render if no coordinates
  if (!event.coordinates) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click handlers

    // Store event selection in sessionStorage for map to read
    sessionStorage.setItem(
      'mapSelectedEvent',
      JSON.stringify({
        id: event.id,
        coordinates: event.coordinates
      })
    );

    router.push('/experiments/map');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-lg',
          'bg-[#8268bc]/20 hover:bg-[#8268bc]/30',
          'text-[#8268bc] text-xs font-medium',
          'transition-all hover:scale-105',
          className
        )}
      >
        <MapIcon className="w-3 h-3" />
        <span>Map</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
        'bg-[#2a1f47]/80 backdrop-blur-sm',
        'border-2 border-[#8268bc]/30 hover:border-[#8268bc]/60',
        'text-[#8268bc] font-bold text-sm',
        'transition-all hover:scale-105 active:scale-95',
        className
      )}
    >
      <MapIcon className="w-4 h-4" />
      <span>View on Map</span>
    </button>
  );
}
