import { useState, useEffect, useCallback } from 'react';

export interface Comment {
  id: string;
  eventId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'eventComments';

export function useComments(eventId: string) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all: Comment[] = stored ? JSON.parse(stored) : [];
    setComments(all.filter(c => c.eventId === eventId));
  }, [eventId]);

  const addComment = useCallback((text: string, authorName: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all: Comment[] = stored ? JSON.parse(stored) : [];
    const next: Comment = {
      id: crypto.randomUUID(),
      eventId,
      authorName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...all]));
    setComments(prev => [next, ...prev]);
    return next;
  }, [eventId]);

  return { comments, addComment };
}
