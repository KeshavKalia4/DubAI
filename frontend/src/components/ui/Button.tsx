'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Button Component
 * 
 * A reusable, accessible, and animated button component.
 * Built with Framer Motion for interactions and Tailwind for styling.
 */

// Define button variants to enforce design consistency
const variants = {
  primary: 'bg-[var(--uw-purple)] text-white hover:bg-[var(--uw-purple-light)] shadow-lg shadow-purple-900/20',
  secondary: 'bg-[var(--uw-gold)] text-[var(--background)] hover:bg-[var(--uw-gold-light)] shadow-lg shadow-yellow-900/20',
  outline: 'border-2 border-[var(--uw-purple)] text-[var(--uw-purple-lighter)] hover:bg-[var(--uw-purple)]/10',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-white',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-base font-semibold',
  icon: 'p-2',
};

// Combine HTML button props with Framer Motion props
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center rounded-xl transition-colors font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uw-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          // Variant & Size
          variants[variant],
          sizes[size],
          className
        )}
        // Micro-interactions
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          /* Simple Loading Spinner */
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        
        {children}

        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
