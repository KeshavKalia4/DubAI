'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Toast Component
 *
 * A reusable toast notification component that appears at the top of the screen.
 * Auto-dismisses after a set duration and supports different variants.
 */

export type ToastVariant = 'error' | 'success' | 'warning' | 'info';

export interface ToastProps {
  /** Unique ID for the toast */
  id: string;
  /** The toast message to display */
  message: string;
  /** Visual variant of the toast */
  variant?: ToastVariant;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
}

// Variant configuration
const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; bg: string; border: string; text: string }
> = {
  error: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
};

export function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  // Auto-dismiss after duration
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl min-w-[320px] max-w-md',
        config.bg,
        config.border,
        config.text
      )}
      role="alert"
    >
      {/* Icon */}
      <Icon className="w-5 h-5 shrink-0" />

      {/* Message */}
      <span className="text-sm font-medium flex-1">{message}</span>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/**
 * ToastContainer Component
 *
 * Container that holds all active toasts, positioned at the top center of the screen.
 */

interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
