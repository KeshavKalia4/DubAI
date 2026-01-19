'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component
 *
 * A reusable, accessible input field with optional icon support.
 * Matches the DubAI design system with dark theme styling.
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon to display on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of the input */
  rightIcon?: React.ReactNode;
  /** Label text displayed above the input */
  label?: string;
  /** Hint text displayed below the input */
  hint?: string;
  /** Error state - adds red border and styling */
  error?: boolean;
  /** Full width container */
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      label,
      hint,
      error = false,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              'w-full py-3 rounded-xl',
              'bg-white/5 border',
              'text-white placeholder:text-[var(--text-tertiary)]',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'transition-all duration-200',
              // Padding based on icons
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              // Border color
              error
                ? 'border-red-500/50 focus:ring-red-500'
                : 'border-white/10 focus:ring-[var(--uw-purple)]',
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Hint Text */}
        {hint && (
          <p
            className={cn(
              'text-xs',
              error ? 'text-red-400' : 'text-[var(--text-tertiary)]'
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
