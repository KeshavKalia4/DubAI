'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import { useEvents } from '@/hooks/useEvents';

// Dynamically import the map component to avoid SSR issues with Leaflet
const InteractiveMapInterface = dynamic(
  () => import('@/components/InteractiveMapInterface'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-3xl bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }
);

export default function MapExperimentPage() {
  const { events, isLoaded } = useEvents();

  // Filter to UW Seattle items that have coordinates
  const mapItems = events.filter(
    item => item.organizationId === 'uw-seattle' && item.coordinates
  );

  return (
    <>
      <NavBar />
      <div className="w-full" style={{ height: 'calc(100vh - 72px)' }}>
        {isLoaded ? (
          <InteractiveMapInterface items={mapItems} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>
    </>
  );
}
