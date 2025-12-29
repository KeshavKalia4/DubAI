'use client';

import React from 'react';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export function Tooltip({ text, position = 'top', children }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group/tooltip relative inline-block">
      {children}
      <div
        className={`
          absolute ${positionClasses[position]}
          px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg
          opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap z-50
        `}
      >
        {text}
      </div>
    </div>
  );
}
