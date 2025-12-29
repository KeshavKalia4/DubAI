'use client';

import * as React from 'react';
import { ToastContainer, ToastProps, ToastVariant } from '@/components/ui/Toast';

/**
 * Toast Context and Hook
 *
 * Provides a global toast notification system that can be triggered from anywhere.
 *
 * Usage:
 * 1. Wrap your app with ToastProvider in layout
 * 2. Use the useToast hook in any component to show toasts
 *
 * Example:
 * ```tsx
 * const { toast } = useToast();
 *
 * toast.success('Event created successfully!');
 * toast.error('Failed to create event');
 * toast.info('Redirecting to preview...');
 * ```
 */

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<
    Array<Omit<ToastProps, 'onDismiss'>>
  >([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback(
    (message: string, variant: ToastVariant, duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    []
  );

  const toast = React.useMemo(
    () => ({
      success: (message: string, duration?: number) =>
        showToast(message, 'success', duration),
      error: (message: string, duration?: number) =>
        showToast(message, 'error', duration),
      warning: (message: string, duration?: number) =>
        showToast(message, 'warning', duration),
      info: (message: string, duration?: number) =>
        showToast(message, 'info', duration),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer
        toasts={toasts.map((t) => ({ ...t, onDismiss: dismissToast }))}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast notifications
 *
 * @throws Error if used outside of ToastProvider
 */
export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
