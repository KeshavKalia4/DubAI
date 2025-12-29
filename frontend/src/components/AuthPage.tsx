'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AuthPageProps {
  mode: 'user' | 'contributor';
}

/**
 * AuthPage Component
 *
 * Handles user signup/login with .edu email validation.
 * Mode determines the flow:
 * - user: Standard student signup/login
 * - contributor: Contributor request flow (Phase 4)
 */
export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate .edu email
  const isValidEduEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.edu$/i;
    return emailRegex.test(email);
  };

  // Extract organization from email domain
  const getOrgFromEmail = (email: string): string => {
    const domain = email.split('@')[1];
    if (domain?.includes('uw.edu')) return 'University of Washington';
    if (domain?.includes('wsu.edu')) return 'Washington State University';
    return domain?.replace('.edu', '') || 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!isValidEduEmail(email)) {
      setError('Please use a valid .edu email address');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        await signup(name.trim(), email);
      }

      // Redirect to main app (which will show onboarding if needed)
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // For contributor mode, show a different form (Phase 4)
  if (mode === 'contributor') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          <h1 className="text-3xl font-bold text-white">Contributor Access</h1>
          <p className="text-[var(--text-secondary)]">
            Contributor registration coming soon. Please check back later.
          </p>
          <Link href="/landing">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Landing
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6"
      >
        <Link href="/landing">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--uw-purple-light)] to-[var(--uw-gold)] bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join DubAI'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {isLogin
              ? 'Sign in with your .edu email'
              : 'Create an account with your .edu email'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field (signup only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--text-secondary)]"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder:text-[var(--text-tertiary)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--uw-purple)] focus:border-transparent',
                    'transition-all duration-200'
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text-secondary)]"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl',
                  'bg-white/5 border border-white/10',
                  'text-white placeholder:text-[var(--text-tertiary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--uw-purple)] focus:border-transparent',
                  'transition-all duration-200'
                )}
              />
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Must be a valid .edu email address
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full"
            isLoading={isLoading}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-[var(--text-secondary)] hover:text-white transition-colors text-sm"
          >
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <span className="text-[var(--uw-gold)] font-medium">Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="text-[var(--uw-gold)] font-medium">Sign in</span>
              </>
            )}
          </button>
        </div>

        {/* Organization Detection Preview */}
        {email && isValidEduEmail(email) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-[var(--text-tertiary)]"
          >
            Detected: <span className="text-[var(--uw-gold)]">{getOrgFromEmail(email)}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
