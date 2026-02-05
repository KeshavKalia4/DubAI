'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useEvents } from '@/hooks/useEvents';
import { ContentItem } from '@/types';

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

// Map common UW campus locations to coordinates
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  // Academic Buildings
  'hub': { lat: 47.6553, lng: -122.3050 },
  'husky union building': { lat: 47.6553, lng: -122.3050 },
  'mary gates hall': { lat: 47.6551, lng: -122.3078 },
  'mgh': { lat: 47.6551, lng: -122.3078 },
  'paul g. allen center': { lat: 47.6531, lng: -122.3058 },
  'cse': { lat: 47.6531, lng: -122.3058 },
  'allen center': { lat: 47.6531, lng: -122.3058 },
  'suzzallo library': { lat: 47.6556, lng: -122.3080 },
  'suzzallo': { lat: 47.6556, lng: -122.3080 },
  'odegaard': { lat: 47.6561, lng: -122.3102 },
  'odegaard library': { lat: 47.6561, lng: -122.3102 },
  'engineering library': { lat: 47.6541, lng: -122.3047 },
  'communications building': { lat: 47.6572, lng: -122.3058 },
  'health sciences building': { lat: 47.6507, lng: -122.3080 },
  'health sciences': { lat: 47.6507, lng: -122.3080 },
  // Outdoor Spaces
  'red square': { lat: 47.6563, lng: -122.3094 },
  'the quad': { lat: 47.6578, lng: -122.3076 },
  'quad': { lat: 47.6578, lng: -122.3076 },
  'drumheller fountain': { lat: 47.6537, lng: -122.3076 },
  'rainier vista': { lat: 47.6530, lng: -122.3076 },
  // Sports & Recreation
  'husky stadium': { lat: 47.6505, lng: -122.3017 },
  'ima': { lat: 47.6530, lng: -122.3015 },
  'intramural activities building': { lat: 47.6530, lng: -122.3015 },
  'waterfront activities center': { lat: 47.6498, lng: -122.3012 },
  'wac': { lat: 47.6498, lng: -122.3012 },
  'alaska airlines arena': { lat: 47.6512, lng: -122.3028 },
  'hec edmundson pavilion': { lat: 47.6512, lng: -122.3028 },
  // Dining & Social
  'by george': { lat: 47.6550, lng: -122.3045 },
  'by george cafe': { lat: 47.6550, lng: -122.3045 },
  'local point': { lat: 47.6554, lng: -122.3148 },
  'eight': { lat: 47.6555, lng: -122.3050 },
  // Residence Halls
  'mcmahon hall': { lat: 47.6604, lng: -122.3140 },
  'lander hall': { lat: 47.6555, lng: -122.3148 },
  'maple hall': { lat: 47.6558, lng: -122.3153 },
  'elm hall': { lat: 47.6558, lng: -122.3160 },
  'alder hall': { lat: 47.6561, lng: -122.3155 },
  // Other
  'kane hall': { lat: 47.6566, lng: -122.3090 },
  'meany hall': { lat: 47.6568, lng: -122.3100 },
  'paccar hall': { lat: 47.6584, lng: -122.3077 },
  'foster school': { lat: 47.6584, lng: -122.3077 },
  'uw campus': { lat: 47.6553, lng: -122.3035 },
};

// Function to get coordinates for a location string
function getLocationCoordinates(location: string | undefined): { lat: number; lng: number } | undefined {
  if (!location) return undefined;

  const normalizedLocation = location.toLowerCase().trim();

  // Direct match
  if (locationCoordinates[normalizedLocation]) {
    return locationCoordinates[normalizedLocation];
  }

  // Partial match - check if any known location is contained in the event location
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return coords;
    }
  }

  return undefined;
}

export default function MapExperimentPage() {
  const { events, isLoading, isLoaded } = useEvents({ limit: 50 });

  // Transform events to include coordinates based on location
  const mapItems = useMemo(() => {
    if (!isLoaded) return [];

    return events
      .map((event): ContentItem => {
        // If event already has coordinates, use them
        if (event.coordinates) {
          return event;
        }

        // Try to get coordinates from the location string
        const coords = getLocationCoordinates(event.location);
        if (coords) {
          return { ...event, coordinates: coords };
        }

        // No coordinates found
        return event;
      })
      .filter(event => event.coordinates); // Only show events with coordinates
  }, [events, isLoaded]);

  // Count events without coordinates for info
  const eventsWithoutCoords = useMemo(() => {
    if (!isLoaded) return 0;
    return events.filter(e => !e.coordinates && !getLocationCoordinates(e.location)).length;
  }, [events, isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavBar />

      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home Page</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Campus Snap Map</h1>
            <p className="text-gray-500">Find events and clubs happening around UW</p>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <p className="text-xs text-gray-400">Loading events...</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                {mapItems.length} locations on campus
                {eventsWithoutCoords > 0 && ` (${eventsWithoutCoords} events without location)`}
              </p>
            )}
          </div>
        </div>

        <InteractiveMapInterface items={mapItems} />
      </div>
    </div>
  );
}
