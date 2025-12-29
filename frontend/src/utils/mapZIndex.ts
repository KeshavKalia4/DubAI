/**
 * Z-Index hierarchy for map components
 * Ensures proper layering of UI elements on the map
 */
export const MAP_Z_INDEX = {
  TILES: 400,           // Leaflet default tile layer
  MARKERS: 600,         // Leaflet default marker layer
  POPUP: 700,           // Leaflet default popup layer
  LEGEND: 900,          // Bottom-left legend
  FILTERS: 1000,        // Top-left filter buttons
  CONTROLS: 1000,       // Top-right control buttons
  EVENT_CARD: 1100,     // Bottom-right event card (highest)
  MODAL_OVERLAY: 1200   // Future: modal backgrounds
} as const;
