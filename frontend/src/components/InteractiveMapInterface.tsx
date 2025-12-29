'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Users, MapPin, X, Navigation, Clock } from 'lucide-react';
import { ContentItem, LocationHub } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { groupEventsByLocation, createHubMarkerIcon } from '@/utils/mapUtils';
import { MAP_Z_INDEX } from '@/utils/mapZIndex';
import HubEventSelector from './HubEventSelector';
import 'leaflet/dist/leaflet.css';

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
  const { theme } = useTheme();
  const [selectedHub, setSelectedHub] = useState<LocationHub | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'event' | 'club'>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(UW_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  const filteredItems = activeFilter === 'all'
    ? items.filter(item => item.coordinates)
    : items.filter(item => item.type === activeFilter && item.coordinates);

  // Group events into location hubs
  const hubs = useMemo(
    () => groupEventsByLocation(filteredItems),
    [filteredItems]
  );

  // Handle navigation from cards (via sessionStorage)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('mapSelectedEvent');
      if (stored) {
        const { id, coordinates } = JSON.parse(stored);
        const event = items.find(e => e.id === id);
        if (event && coordinates) {
          setMapCenter([coordinates.lat, coordinates.lng]);
          setMapZoom(17);
          // Find hub containing this event
          const hub = hubs.find(h => h.events.some(e => e.id === id));
          if (hub) {
            setSelectedHub(hub);
            if (hub.count === 1) {
              setSelectedItem(event);
            }
          }
        }
        sessionStorage.removeItem('mapSelectedEvent');
      }
    } catch (error) {
      console.error('Error reading mapSelectedEvent:', error);
      sessionStorage.removeItem('mapSelectedEvent');
    }
  }, [items, hubs]);

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

  const handleResetView = () => {
    setMapCenter(UW_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    setSelectedHub(null);
    setSelectedItem(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Filter Controls */}
      <div className="absolute top-4 left-4 flex gap-2" style={{ zIndex: MAP_Z_INDEX.FILTERS }}>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md border-2 ${
            activeFilter === 'all'
              ? 'bg-linear-to-r from-[#8268bc] to-[#6b4ea8] text-white border-[#8268bc]/60 shadow-[0_8px_20px_rgba(107,78,168,0.5)]'
              : 'bg-[#2a1f47]/60 text-[#d4d4d4] border-[#8268bc]/30 hover:bg-[#2a1f47]/80 hover:border-[#8268bc]/50 shadow-[0_4px_12px_rgba(107,78,168,0.2)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('event')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md border-2 ${
            activeFilter === 'event'
              ? 'bg-linear-to-r from-[#8268bc] to-[#6b4ea8] text-white border-[#8268bc]/60 shadow-[0_8px_20px_rgba(107,78,168,0.5)]'
              : 'bg-[#2a1f47]/60 text-[#d4d4d4] border-[#8268bc]/30 hover:bg-[#2a1f47]/80 hover:border-[#8268bc]/50 shadow-[0_4px_12px_rgba(107,78,168,0.2)]'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveFilter('club')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md border-2 ${
            activeFilter === 'club'
              ? 'bg-linear-to-r from-[#8268bc] to-[#6b4ea8] text-white border-[#8268bc]/60 shadow-[0_8px_20px_rgba(107,78,168,0.5)]'
              : 'bg-[#2a1f47]/60 text-[#d4d4d4] border-[#8268bc]/30 hover:bg-[#2a1f47]/80 hover:border-[#8268bc]/50 shadow-[0_4px_12px_rgba(107,78,168,0.2)]'
          }`}
        >
          Clubs
        </button>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2" style={{ zIndex: MAP_Z_INDEX.CONTROLS }}>
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          title="Find my location"
          className="bg-[#2a1f47]/80 backdrop-blur-md p-3 rounded-xl border-2 border-[#8268bc]/30 shadow-[0_4px_12px_rgba(107,78,168,0.25)] hover:bg-[#362955]/80 hover:border-[#8268bc]/50 transition-all disabled:opacity-50"
        >
          <Navigation className={`w-5 h-5 text-[#8268bc] ${isLocating ? 'animate-pulse' : ''}`} />
        </button>
        <button
          onClick={handleResetView}
          title="Reset to campus view"
          className="bg-[#2a1f47]/80 backdrop-blur-md p-3 rounded-xl border-2 border-[#8268bc]/30 shadow-[0_4px_12px_rgba(107,78,168,0.25)] hover:bg-[#362955]/80 hover:border-[#8268bc]/50 transition-all"
        >
          <MapPin className="w-5 h-5 text-[#8268bc]" />
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
          key={theme}
          attribution={
            theme === 'dark'
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          url={
            theme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          maxZoom={theme === 'dark' ? 20 : 19}
        />

        {/* MapController for programmatic view changes */}
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Location Hub Markers */}
        {hubs.map((hub) => {
          const isHubSelected = selectedHub?.id === hub.id;
          const isSelectorOpen = selectedHub && selectedHub.count > 1 && !selectedItem;
          const shouldBlur = !!(isSelectorOpen && !isHubSelected);

          return (
            <Marker
              key={hub.id}
              position={[hub.coordinates.lat, hub.coordinates.lng]}
              icon={createHubMarkerIcon(hub.count, isHubSelected, shouldBlur)}
              eventHandlers={{
                click: () => {
                  setSelectedHub(hub);
                  setMapCenter([hub.coordinates.lat, hub.coordinates.lng]);
                  setMapZoom(17);
                  if (hub.count === 1) {
                    setSelectedItem(hub.events[0]);
                  } else {
                    setSelectedItem(null); // Show hub selector instead
                  }
                },
              }}
            />
          );
        })}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon} />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg" style={{ zIndex: MAP_Z_INDEX.LEGEND }}>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8268bc]"></div>
            <span className="text-gray-600 dark:text-gray-300">Hubs</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-300">You</span>
            </div>
          )}
        </div>
      </div>

      {/* Hub Event Selector (for hubs with multiple events) */}
      {selectedHub && selectedHub.count > 1 && !selectedItem && (
        <HubEventSelector
          hub={selectedHub}
          onSelectEvent={(event) => setSelectedItem(event)}
          onClose={() => setSelectedHub(null)}
          theme={theme}
        />
      )}

      {/* Selected Item Card */}
      {selectedItem && (
        <div
          className="fixed bottom-0 md:bottom-4 left-0 right-0 md:left-auto md:right-4 w-full md:w-96 max-h-[70vh] overflow-y-auto bg-linear-to-br from-[#1e1432]/95 to-[#2a1f47]/90 backdrop-blur-md rounded-t-3xl md:rounded-2xl shadow-[0_20px_60px_rgba(107,78,168,0.4)] border-2 border-[#8268bc]/40 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300"
          style={{ zIndex: MAP_Z_INDEX.EVENT_CARD }}
        >
          <button
            onClick={() => {
              setSelectedItem(null);
              setSelectedHub(null);
            }}
            className="absolute top-3 right-3 p-1 text-[#a3a3a3] hover:text-[#f5f5f5] rounded-full hover:bg-[#362955]/60 z-10"
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
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg backdrop-blur-sm shadow-md border-2 ${
                selectedItem.type === 'event'
                  ? 'bg-[#4B2E83]/20 text-[#8268bc] border-[#8268bc]/30'
                  : 'bg-[#B7A57A]/20 text-[#d4c79f] border-[#d4c79f]/30'
              }`}>
                {selectedItem.type === 'event' ? 'Event' : 'Club'}
              </span>
              {selectedItem.date && (
                <span className="text-xs text-[#d4d4d4] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8268bc]" />
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

            <h3 className="text-lg font-bold text-[#f5f5f5] mb-1">{selectedItem.title}</h3>
            <p className="text-sm text-[#d4d4d4] line-clamp-2 mb-3">{selectedItem.description}</p>

            {selectedItem.aiSummary && (
              <p className="text-xs text-[#d4d4d4] italic mb-3 bg-[#2a1f47]/80 p-2 rounded-lg border border-[#8268bc]/20">
                {selectedItem.aiSummary}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[#d4d4d4]">
                <MapPin className="w-3 h-3 text-[#8268bc]" />
                {selectedItem.location || 'On Campus'}
              </div>

              {selectedItem.attendees && (
                <div className="flex items-center gap-1 text-xs text-[#d4d4d4]">
                  <Users className="w-3 h-3 text-[#8268bc]" />
                  {selectedItem.attendees.count} attending
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-linear-to-r from-[#8268bc] to-[#6b4ea8] hover:from-[#9982d0] hover:to-[#8268bc] text-white font-semibold py-2.5 rounded-xl shadow-[0_8px_20px_rgba(107,78,168,0.4)] transition-all">
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
