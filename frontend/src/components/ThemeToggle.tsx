'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Don't call useTheme until we're mounted
  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="h-10 w-20" />
    );
  }

  return <ThemeToggleButton />;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-9 sm:h-10 w-18 sm:w-20 items-center rounded-full bg-[#e8e4f0] dark:bg-[#362955] p-1 transition-all duration-300 hover:scale-105 shadow-inner"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track gradient overlay */}
      <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#f5f0ff] to-[#faf8ff] dark:from-[#2a1f47] dark:to-[#362955] opacity-50"></div>

      {/* Sliding toggle ball */}
      <div
        className={`relative z-10 flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-linear-to-br from-[#4B2E83] to-[#5d3a9b] shadow-lg transition-all duration-300 ease-out ${
          isDark ? 'translate-x-10 sm:translate-x-12' : 'translate-x-0'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#6b4ea8] to-[#8268bc] blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>

        {/* Icon */}
        <div className="relative z-10">
          {isDark ? (
            <Moon className="h-4 w-4 text-white animate-fade-in" strokeWidth={2.5} />
          ) : (
            <Sun className="h-4 w-4 text-white animate-fade-in" strokeWidth={2.5} />
          )}
        </div>
      </div>

      {/* Icons on track (optional decorative) */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={`h-3.5 w-3.5 transition-opacity duration-300 ${!isDark ? 'opacity-0' : 'opacity-40 text-[#d4c79f]'}`} strokeWidth={2} />
        <Moon className={`h-3.5 w-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40 text-[#4B2E83]'}`} strokeWidth={2} />
      </div>
    </button>
  );
}
