'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/hooks/useToast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
