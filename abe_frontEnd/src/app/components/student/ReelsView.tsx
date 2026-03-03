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
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (events.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No events to display</p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-[#4b2e83] text-white rounded-xl font-bold hover:bg-[#5e3a9e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gray-900 overflow-y-scroll transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
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
        className="fixed top-4 right-4 z-[10000] w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 hover:bg-white shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Close reels"
      >
        <X className="w-6 h-6 text-[#4b2e83]" />
      </button>

      {/* Reel Cards */}
      {events.map((event, index) => (
        <ReelCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};

export default ReelsView;
