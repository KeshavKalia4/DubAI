'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * TextArea Component
 *
 * A reusable, accessible textarea field.
 * Matches the DubAI design system with dark theme styling.
 */

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Hint text displayed below the textarea */
  hint?: string;
  /** Error state - adds red border and styling */
  error?: boolean;
  /** Full width container */
  fullWidth?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      hint,
      error = false,
      fullWidth = true,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}

        {/* TextArea Field */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            // Base styles
            'w-full px-4 py-3 rounded-xl',
            'bg-white/5 border',
            'text-white placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'transition-all duration-200',
            'resize-none',
            // Border color
            error
              ? 'border-red-500/50 focus:ring-red-500'
              : 'border-white/10 focus:ring-[var(--uw-purple)]',
            className
          )}
          {...props}
        />

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

TextArea.displayName = 'TextArea';
