'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { uwEvents } from '@/data/uwEvents';

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
  // Filter to UW Seattle items that have coordinates
  const mapItems = uwEvents.filter(
    item => item.organizationId === 'uw-seattle' && item.coordinates
  );

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
            <p className="text-xs text-gray-400 mt-1">{mapItems.length} locations on campus</p>
          </div>
        </div>

        <InteractiveMapInterface items={mapItems} />
      </div>
    </div>
  );
}
