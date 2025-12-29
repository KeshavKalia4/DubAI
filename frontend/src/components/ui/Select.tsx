'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Select Component
 *
 * A reusable, accessible select dropdown.
 * Matches the DubAI design system with dark theme styling.
 */

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Label text displayed above the select */
  label?: string;
  /** Hint text displayed below the select */
  hint?: string;
  /** Error state - adds red border and styling */
  error?: boolean;
  /** Full width container */
  fullWidth?: boolean;
  /** Options for the select dropdown */
  options: SelectOption[];
  /** Placeholder text when no option is selected */
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      hint,
      error = false,
      fullWidth = true,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base styles
              'w-full px-4 py-3 rounded-xl',
              'bg-white/5 border',
              'text-white',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'transition-all duration-200',
              'appearance-none cursor-pointer',
              'pr-10', // Space for chevron
              // Border color
              error
                ? 'border-red-500/50 focus:ring-red-500'
                : 'border-white/10 focus:ring-[var(--uw-purple)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[var(--background)] text-[var(--text-tertiary)]">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[var(--background)] text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]">
            <ChevronDown className="w-5 h-5" />
          </div>
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

Select.displayName = 'Select';
