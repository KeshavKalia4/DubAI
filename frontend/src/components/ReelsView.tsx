'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ContentItem } from '@/types';
import ReelCard from './ReelCard';

interface ReelsViewProps {
  events: ContentItem[];
  onClose: () => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ events, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when reels open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle empty events
  if (events.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0f0a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#a3a3a3]">No events to display</p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-[#8268bc] text-white rounded-xl font-bold hover:bg-[#9b7fd4] transition-colors"
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
        bg-[#0f0a1a]
        overflow-y-scroll
        ${isClosing ? 'animate-reels-slide-down' : 'animate-reels-slide-up'}
      `}
      style={{
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="
          fixed top-4 right-4 z-[10000]
          w-12 h-12 rounded-full
          bg-[#2a1f47]/90 backdrop-blur-md
          border-2 border-[#8268bc]/40
          hover:bg-[#362955] hover:border-[#8268bc]/60
          active:scale-95
          transition-all duration-200
          flex items-center justify-center
        "
        aria-label="Close reels"
      >
        <X className="w-6 h-6 text-[#8268bc]" />
      </button>

      {/* Reel Cards */}
      {events.map((event, index) => (
        <ReelCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};

export default ReelsView;
