'use client';

import { useState } from 'react';
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<'signin' | 'signup' | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleSignUp = () => {
    setError('');
    setSignedUp(true);
  };

  const handleSignIn = async () => {
    setError('');
    setIsLoading('signin');

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-purple-600">FindMyEvents</span>
        </div>

        <div className="bg-purple-600 rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Welcome
          </h1>
          <p className="text-white/80 text-center mb-8">
            Discover events on campus
          </p>

          {error && (
            <p className="text-red-300 text-sm text-center mb-4 bg-red-500/20 p-2 rounded-lg">{error}</p>
          )}

          {signedUp && (
            <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 mb-4">
              <p className="text-green-300 text-sm text-center font-medium">
                Signed up successfully! Now sign in below.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoading !== null}
              className="w-full py-3 px-4 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              {isLoading === 'signin' ? 'Signing in...' : 'Sign in with Google'}
            </button>

            {!signedUp && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/30"></div>
                  <span className="text-white/60 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/30"></div>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSignUp}
                  className="w-full py-3 px-4 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-400 transition-colors flex items-center justify-center gap-3 border-2 border-white/30"
                >
                  <GoogleIcon />
                  Sign up with Google
                </button>
              </>
            )}
          </div>

          <p className="text-white/60 text-xs text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
