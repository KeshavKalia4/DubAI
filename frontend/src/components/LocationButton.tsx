/**
 * LocationButton Component
 *
 * Reusable location button with map navigation.
 * Eliminates duplicate map navigation logic across ContentCard and ReelCard.
 *
 * Features:
 * - Displays location with MapPin icon
 * - Navigates to map view with selected event
 * - Stores event data in sessionStorage for map consumption
 * - Disabled state when coordinates are missing
 * - Tooltip support
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface LocationButtonProps {
  /** Event ID for map selection */
  eventId: string;
  /** Event coordinates (latitude, longitude) */
  coordinates?: { lat: number; lng: number };
  /** Location name to display */
  location: string;
  /** Optional additional className for styling variations */
  className?: string;
  /** Tooltip position */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Button size variant */
  variant?: 'default' | 'compact';
}

const MAP_SELECTED_EVENT_KEY = 'mapSelectedEvent' as const;

export function LocationButton({
  eventId,
  coordinates,
  location,
  className = '',
  tooltipPosition = 'top',
  variant = 'default',
}: LocationButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (coordinates) {
      sessionStorage.setItem(
        MAP_SELECTED_EVENT_KEY,
        JSON.stringify({
          id: eventId,
          coordinates,
        })
      );
      router.push('/experiments/map');
    }
  };

  const baseClasses = `
    flex items-center gap-2.5 rounded-xl
    bg-[#2a1f47]/60 backdrop-blur-sm
    border border-[#8268bc]/10
    transition-all
    ${coordinates
      ? 'hover:border-[#8268bc]/50 hover:bg-[#362955]/40 cursor-pointer'
      : 'cursor-default'
    }
  `;

  const variantClasses = {
    default: 'w-full px-4 py-2.5',
    compact: 'px-3 py-2',
  };

  return (
    <Tooltip text="View on map" position={tooltipPosition}>
      <button
        onClick={handleClick}
        disabled={!coordinates}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      >
        <MapPin className="w-4 h-4 text-[#8268bc] shrink-0" />
        <span
          className={`text-sm font-medium truncate ${
            coordinates ? 'text-[#d4d4d4] group-hover/tooltip:text-white' : 'text-[#d4d4d4]'
          }`}
        >
          {location}
        </span>
      </button>
    </Tooltip>
  );
}
