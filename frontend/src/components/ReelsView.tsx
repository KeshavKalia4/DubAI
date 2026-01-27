'use client';

import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from '@/types';
import ReelCard from './ReelCard';

interface ReelsViewProps {
  events: ContentItem[];
  onClose: () => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ events, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const goToNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Touch handlers for swipe
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart) {
      const offset = e.targetTouches[0].clientX - touchStart;
      setSwipeOffset(offset);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (events.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No events to display</p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        bg-black/95 backdrop-blur-sm
        flex items-center justify-center
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      `}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="
          fixed top-4 right-4 z-[10000]
          w-12 h-12 rounded-full
          bg-white/10 backdrop-blur-md
          border border-white/20
          hover:bg-white/20
          active:scale-95
          transition-all duration-200
          flex items-center justify-center
        "
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Arrows - Desktop */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        className={`
          hidden md:flex
          fixed left-4 top-1/2 -translate-y-1/2 z-[10000]
          w-12 h-12 rounded-full
          bg-white/10 backdrop-blur-md
          border border-white/20
          hover:bg-white/20
          active:scale-95
          transition-all duration-200
          items-center justify-center
          ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}
        `}
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        disabled={currentIndex === events.length - 1}
        className={`
          hidden md:flex
          fixed right-4 top-1/2 -translate-y-1/2 z-[10000]
          w-12 h-12 rounded-full
          bg-white/10 backdrop-blur-md
          border border-white/20
          hover:bg-white/20
          active:scale-95
          transition-all duration-200
          items-center justify-center
          ${currentIndex === events.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}
        `}
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Card Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-md mx-4 h-[85vh] max-h-[700px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Cards Stack */}
        {events.map((event, index) => {
          const offset = index - currentIndex;
          const isActive = offset === 0;
          const isPrev = offset < 0;
          const isNext = offset > 0;

          // Only render nearby cards for performance
          if (Math.abs(offset) > 2) return null;

          return (
            <div
              key={event.id}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                transform: `
                  translateX(${offset * 100 + (isActive ? swipeOffset * 0.3 : 0)}%)
                  scale(${isActive ? 1 : 0.9})
                  rotateY(${offset * -5}deg)
                `,
                opacity: isActive ? 1 : 0.5,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <ReelCard event={event} index={index} isActive={isActive} />
            </div>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'}
            `}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="fixed top-4 left-4 z-[10000] text-white/70 text-sm font-medium">
        {currentIndex + 1} / {events.length}
      </div>
    </div>
  );
};

export default ReelsView;
