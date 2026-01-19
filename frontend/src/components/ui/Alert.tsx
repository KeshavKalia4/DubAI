'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Alert Component
 *
 * A reusable alert/notification component with different variants.
 * Includes entrance animation and appropriate icons.
 */

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  /** The alert message to display */
  message: string;
  /** Visual variant of the alert */
  variant?: AlertVariant;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Optional callback when alert is dismissed */
  onDismiss?: () => void;
}

// Variant configuration
const variantConfig: Record<
  AlertVariant,
  { icon: React.ElementType; bg: string; border: string; text: string }
> = {
  error: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
  },
};

export function Alert({
  message,
  variant = 'error',
  className,
  showIcon = true,
  onDismiss,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg border',
        config.bg,
        config.border,
        config.text,
        className
      )}
      role="alert"
    >
      {showIcon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="text-sm flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss alert"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
