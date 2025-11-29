'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't call useTheme until we're mounted
  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="h-10 w-10" />
    );
  }

  return <ThemeToggleButton />;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-300 dark:text-gray-300 transition-transform duration-300" />
      )}
    </button>
  );
}
