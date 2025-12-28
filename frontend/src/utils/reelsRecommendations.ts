import { ContentItem } from '@/types';

/**
 * Generate sorted reels order starting with clicked event
 * Priority: Tag Similarity > Location Proximity > Date Proximity
 */
export function generateReelsOrder(
  allEvents: ContentItem[],
  clickedEventId: string
): ContentItem[] {
  const clickedEvent = allEvents.find(e => e.id === clickedEventId);
  if (!clickedEvent) return allEvents;

  // 1. Remove clicked event from pool
  const otherEvents = allEvents.filter(e => e.id !== clickedEventId);

  // 2. Score each event
  const scoredEvents = otherEvents.map(event => {
    let score = 0;

    // === TAG SIMILARITY (Highest Priority: 0-50 points) ===
    const clickedTags = new Set(clickedEvent.tags);
    const matchingTags = event.tags.filter(tag => clickedTags.has(tag));
    const tagScore = matchingTags.length * 10;
    score += tagScore;

    // === LOCATION PROXIMITY (Medium Priority: 0-30 points) ===
    if (clickedEvent.coordinates && event.coordinates) {
      const distance = calculateDistance(
        clickedEvent.coordinates,
        event.coordinates
      );

      // Scoring scale (UW campus is ~1km across):
      // 0-200m: +30 points (very close, same building area)
      // 200-500m: +20 points (nearby building)
      // 500-1000m: +10 points (different part of campus)
      // >1000m: +5 points (far, but same campus)

      let locationScore = 0;
      if (distance < 0.2) locationScore = 30;
      else if (distance < 0.5) locationScore = 20;
      else if (distance < 1.0) locationScore = 10;
      else locationScore = 5;

      score += locationScore;
    }

    // === DATE PROXIMITY (Lower Priority: 0-20 points) ===
    if (clickedEvent.date && event.date) {
      const clickedDate = new Date(clickedEvent.date);
      const eventDate = new Date(event.date);
      const daysDiff = Math.abs(
        (eventDate.getTime() - clickedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Scoring scale:
      // Same day: +20 points
      // Within 3 days: +15 points
      // Within week: +10 points
      // Within month: +5 points
      // Different month: +2 points

      let dateScore = 0;
      if (daysDiff < 1) dateScore = 20;
      else if (daysDiff < 3) dateScore = 15;
      else if (daysDiff < 7) dateScore = 10;
      else if (daysDiff < 30) dateScore = 5;
      else dateScore = 2;

      score += dateScore;
    }

    // === TYPE MATCH BONUS (5 points) ===
    if (event.type === clickedEvent.type) {
      score += 5;
    }

    return {
      event,
      score
    };
  });

  // 3. Sort by score (descending)
  scoredEvents.sort((a, b) => b.score - a.score);

  // 4. Return clicked event first, then sorted recommendations
  return [clickedEvent, ...scoredEvents.map(s => s.event)];
}

/**
 * Haversine formula for distance calculation
 * Returns distance in kilometers
 */
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
