/**
 * UW Campus Building Coordinates Lookup
 *
 * Provides a reusable mapping from building names/abbreviations
 * to GPS coordinates for the UW Seattle campus.
 *
 * Usage:
 *   getCoordinates('HUB')           -> { lat: 47.6553, lng: -122.3050 }
 *   getCoordinates('More Hall 220') -> { lat: 47.6547, lng: -122.3045 }
 *   getCoordinates('Unknown')       -> null (graceful fallback)
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Canonical coordinate map for UW Seattle campus buildings.
 * Keys are normalized building names (lowercase, trimmed).
 *
 * To add a new building:
 *   1. Add entry with normalized key
 *   2. Include common aliases if applicable
 */
const UW_BUILDING_COORDINATES: Record<string, Coordinates> = {
  // Student Union
  hub: { lat: 47.6553, lng: -122.305 },
  'husky union building': { lat: 47.6553, lng: -122.305 },
  'by george': { lat: 47.655, lng: -122.3045 },
  'by george cafe': { lat: 47.655, lng: -122.3045 },

  // Engineering/CS Buildings
  'paul g. allen center': { lat: 47.6531, lng: -122.3058 },
  'allen center': { lat: 47.6531, lng: -122.3058 },
  cse: { lat: 47.6531, lng: -122.3058 },
  'cse building': { lat: 47.6531, lng: -122.3058 },
  'more hall': { lat: 47.6547, lng: -122.3045 },
  mor: { lat: 47.6547, lng: -122.3045 },
  'engineering library': { lat: 47.6541, lng: -122.3047 },
  'eng library': { lat: 47.6541, lng: -122.3047 },

  // Libraries
  'suzzallo library': { lat: 47.6556, lng: -122.308 },
  suzzallo: { lat: 47.6556, lng: -122.308 },
  suz: { lat: 47.6556, lng: -122.308 },
  odegaard: { lat: 47.6564, lng: -122.3101 },
  oug: { lat: 47.6564, lng: -122.3101 },
  'odegaard library': { lat: 47.6564, lng: -122.3101 },

  // Academic Buildings
  'mary gates hall': { lat: 47.6551, lng: -122.3078 },
  mgh: { lat: 47.6551, lng: -122.3078 },
  'communications building': { lat: 47.6572, lng: -122.3058 },
  cmn: { lat: 47.6572, lng: -122.3058 },
  comm: { lat: 47.6572, lng: -122.3058 },
  paa: { lat: 47.658, lng: -122.307 },
  'parrington hall': { lat: 47.658, lng: -122.307 },
  'health sciences building': { lat: 47.6507, lng: -122.308 },
  'health sciences': { lat: 47.6507, lng: -122.308 },
  hsb: { lat: 47.6507, lng: -122.308 },
  'kane hall': { lat: 47.6566, lng: -122.3084 },
  kne: { lat: 47.6566, lng: -122.3084 },

  // Athletic/Recreation
  ima: { lat: 47.6535, lng: -122.301 },
  'intramural activities': { lat: 47.6535, lng: -122.301 },
  'intramural activities building': { lat: 47.6535, lng: -122.301 },
  'husky stadium': { lat: 47.6505, lng: -122.3017 },
  'waterfront activities center': { lat: 47.6498, lng: -122.3012 },
  wac: { lat: 47.6498, lng: -122.3012 },

  // Outdoor Spaces
  'red square': { lat: 47.6563, lng: -122.3094 },
  quad: { lat: 47.6574, lng: -122.3056 },
  'the quad': { lat: 47.6574, lng: -122.3056 },
  drumheller: { lat: 47.6524, lng: -122.3085 },
  'drumheller fountain': { lat: 47.6524, lng: -122.3085 },
};

/**
 * Normalizes a location string for lookup.
 * Strips room numbers, trims whitespace, converts to lowercase.
 */
function normalizeLocation(location: string): string {
  return (
    location
      .toLowerCase()
      .trim()
      // Remove room numbers like "220", "A110" at end
      .replace(/\s+\d+\s*$/, '')
      .replace(/\s+[a-z]?\d+\s*$/i, '')
      .trim()
  );
}

/**
 * Get coordinates for a location string.
 * Handles building names with room numbers (e.g., "More Hall 220").
 *
 * @param location - Location string (e.g., "HUB", "More Hall 220")
 * @returns Coordinates if found, null otherwise
 */
export function getCoordinates(
  location: string | undefined
): Coordinates | null {
  if (!location) return null;

  const normalized = normalizeLocation(location);

  // Direct match
  if (UW_BUILDING_COORDINATES[normalized]) {
    return UW_BUILDING_COORDINATES[normalized];
  }

  // Partial match (e.g., "By George Cafe (HUB)" contains "hub")
  for (const [key, coords] of Object.entries(UW_BUILDING_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  return null;
}

/**
 * Check if a location has known coordinates.
 */
export function hasKnownLocation(location: string | undefined): boolean {
  return getCoordinates(location) !== null;
}

/**
 * Get all known building names (for autocomplete/validation).
 */
export function getKnownBuildings(): string[] {
  return Object.keys(UW_BUILDING_COORDINATES);
}
