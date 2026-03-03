import { ContentItem, UserProfile } from '@/types';

export function generateReelsOrder(
  allEvents: ContentItem[],
  clickedEventId: string,
  _user: UserProfile
): ContentItem[] {
  const clickedEvent = allEvents.find(e => e.id === clickedEventId);
  if (!clickedEvent) return allEvents;

  const otherEvents = allEvents.filter(e => e.id !== clickedEventId);

  const scoredEvents = otherEvents.map(event => {
    let score = 0;

    const clickedTags = new Set(clickedEvent.tags);
    const matchingTags = event.tags.filter(tag => clickedTags.has(tag));
    score += matchingTags.length * 10;

    if (clickedEvent.coordinates && event.coordinates) {
      const distance = calculateDistance(clickedEvent.coordinates, event.coordinates);
      if (distance < 0.2) score += 30;
      else if (distance < 0.5) score += 20;
      else if (distance < 1.0) score += 10;
      else score += 5;
    }

    if (clickedEvent.date && event.date) {
      const clickedDate = new Date(clickedEvent.date);
      const eventDate = new Date(event.date);
      const daysDiff = Math.abs((eventDate.getTime() - clickedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 1) score += 20;
      else if (daysDiff < 3) score += 15;
      else if (daysDiff < 7) score += 10;
      else if (daysDiff < 30) score += 5;
      else score += 2;
    }

    if (event.type === clickedEvent.type) score += 5;

    return { event, score };
  });

  scoredEvents.sort((a, b) => b.score - a.score);

  return [clickedEvent, ...scoredEvents.map(s => s.event)];
}

function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
