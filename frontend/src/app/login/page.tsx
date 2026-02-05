'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, user, isLoading: authLoading } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/explore';

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectUrl);
    }
  }, [authLoading, user, router, redirectUrl]);

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signInWithGoogle(redirectUrl);
      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
      // Don't set isLoading to false on success - we're redirecting to Google
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1025] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="text-center relative z-10">
          <svg className="animate-spin h-10 w-10 text-[#8268bc] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1025] px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#6b4ea8]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="font-bold text-3xl">
            <span className="bg-gradient-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#d4d4d4] bg-clip-text text-transparent">
              FindMyEvents
            </span>
          </span>
        </div>

        <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-8 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
          <h1 className="text-2xl font-bold text-[#f5f5f5] mb-2 text-center">
            Welcome
          </h1>
          <p className="text-[#a3a3a3] text-center mb-8">
            Discover events on campus
          </p>

          {error && (
            <p className="text-red-300 text-sm text-center mb-4 bg-red-500/20 p-2 rounded-lg border border-red-500/30">{error}</p>
          )}

          <div className="space-y-4">
            {/* Continue with Google Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
            >
              <GoogleIcon />
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          <p className="text-[#a3a3a3] text-xs text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
