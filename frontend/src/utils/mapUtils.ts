import L from 'leaflet';
import { ContentItem, LocationHub } from '@/types';

/**
 * Groups events by their exact coordinates
 * Events at the same location are clustered into a single hub
 *
 * @param items - Array of content items (events/clubs) to group
 * @returns Array of location hubs with grouped events
 */
export function groupEventsByLocation(items: ContentItem[]): LocationHub[] {
  const hubMap = new Map<string, LocationHub>();

  items.forEach(item => {
    if (!item.coordinates) return;

    // Create unique key from coordinates (rounded to 6 decimals for exact match)
    const key = `${item.coordinates.lat.toFixed(6)},${item.coordinates.lng.toFixed(6)}`;

    if (!hubMap.has(key)) {
      hubMap.set(key, {
        id: key,
        coordinates: item.coordinates,
        location: item.location || 'Unknown Location',
        events: [],
        count: 0
      });
    }

    const hub = hubMap.get(key)!;
    hub.events.push(item);
    hub.count++;
  });

  return Array.from(hubMap.values());
}

/**
 * Creates a custom Leaflet DivIcon for location hubs
 * Shows event count badge and themed styling
 *
 * @param count - Number of events at this location
 * @param isSelected - Whether this hub is currently selected
 * @param shouldBlur - Whether to apply blur effect (when behind selector)
 * @returns Leaflet DivIcon for the hub marker
 */
export function createHubMarkerIcon(
  count: number,
  isSelected: boolean,
  shouldBlur: boolean = false
): L.DivIcon {
  const size = isSelected ? 54 : 44;
  const textColor = '#ffffff';

  return L.divIcon({
    className: `hub-marker ${shouldBlur ? 'hub-marker-blurred' : ''}`,
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #8268bc 0%, #d4c79f 100%);
        border: 4px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 6px 20px rgba(130,104,188,0.5),
          0 0 40px rgba(130,104,188,0.3),
          0 0 60px rgba(212,199,159,0.2),
          inset 0 0 20px rgba(255,255,255,0.2);
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.2);' : ''}
        ${shouldBlur ? 'filter: blur(3px); opacity: 0.5;' : ''}
      ">
        <span style="
          color: ${textColor};
          font-size: ${count > 9 ? '14px' : '18px'};
          font-weight: bold;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        ">${count}</span>
      </div>
      ${isSelected ? `
        <div style="
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: ${size + 24}px;
          height: ${size + 24}px;
          background: radial-gradient(circle, rgba(130,104,188,0.4) 0%, rgba(212,199,159,0.2) 100%);
          opacity: 0.3;
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      ` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
