'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Users, MapPin, X, Navigation, Clock } from 'lucide-react';
import { ContentItem } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const createCustomIcon = (type: 'event' | 'club', isSelected: boolean) => {
  const color = type === 'event' ? '#f97316' : '#a855f7'; // orange-500 / purple-500
  const size = isSelected ? 44 : 36;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          ${type === 'event'
            ? '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
            : '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
          }
        </svg>
      </div>
      ${isSelected ? `
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: ${size + 16}px;
          height: ${size + 16}px;
          background: ${color};
          opacity: 0.3;
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      ` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// User location marker
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle map centering
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

interface InteractiveMapInterfaceProps {
  items: ContentItem[];
}

// UW Campus center coordinates
const UW_CENTER: [number, number] = [47.6553, -122.3035];
const DEFAULT_ZOOM = 16;

export default function InteractiveMapInterface({ items }: InteractiveMapInterfaceProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'event' | 'club'>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(UW_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  const filteredItems = activeFilter === 'all'
    ? items.filter(item => item.coordinates)
    : items.filter(item => item.type === activeFilter && item.coordinates);

  const handleLocateUser = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userCoords);
        setMapCenter(userCoords);
        setMapZoom(17); // Zoom in closer when locating user
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSelectItem = (item: ContentItem) => {
    setSelectedItem(item);
    if (item.coordinates) {
      setMapCenter([item.coordinates.lat, item.coordinates.lng]);
      setMapZoom(17); // Zoom in on selected item
    }
  };

  const handleResetView = () => {
    setMapCenter(UW_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    setSelectedItem(null);
  };

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
      {/* Filter Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-[1000]">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('event')}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all ${
            activeFilter === 'event'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveFilter('club')}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all ${
            activeFilter === 'club'
              ? 'bg-purple-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Clubs
        </button>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          title="Find my location"
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <Navigation className={`w-5 h-5 text-blue-600 ${isLocating ? 'animate-pulse' : ''}`} />
        </button>
        <button
          onClick={handleResetView}
          title="Reset to campus view"
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all"
        >
          <MapPin className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={UW_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MapController for programmatic view changes */}
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Event/Club Markers */}
        {filteredItems.map((item) => (
          item.coordinates && (
            <Marker
              key={item.id}
              position={[item.coordinates.lat, item.coordinates.lng]}
              icon={createCustomIcon(item.type as 'event' | 'club', selectedItem?.id === item.id)}
              eventHandlers={{
                click: () => handleSelectItem(item),
              }}
            />
          )
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon} />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Clubs</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">You</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Item Card */}
      {selectedItem && (
        <div className="absolute bottom-4 right-4 left-auto z-[1000] w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedItem.imageUrl && (
            <div className="h-32 w-full overflow-hidden relative">
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                selectedItem.type === 'event' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {selectedItem.type === 'event' ? 'Event' : 'Club'}
              </span>
              {selectedItem.date && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedItem.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedItem.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{selectedItem.description}</p>

            {selectedItem.aiSummary && (
              <p className="text-xs text-gray-500 italic mb-3 bg-gray-50 p-2 rounded-lg">
                {selectedItem.aiSummary}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {selectedItem.location || 'On Campus'}
              </div>

              {selectedItem.attendees && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  {selectedItem.attendees.count} attending
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Custom styles for markers */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .user-location-marker {
          background: transparent !important;
          border: none !important;
        }
        @keyframes ping {
          75%, 100% {
            transform: translateX(-50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
