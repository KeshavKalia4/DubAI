'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { isValidEduEmail, getOrgFromEmail } from '@/lib/emailUtils';
import Link from 'next/link';

/**
 * Auth Page
 *
 * Handles user signup/login with .edu email validation.
 * Query params:
 * - ?mode=user → Student signup/login
 * - ?mode=contributor → Redirects to contributor page
 */

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const { signup, login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      // Redirect based on mode: contributor goes to /contributor, user goes to /feed
      if (mode === 'contributor') {
        router.push('/contributor');
      } else {
        router.push('/feed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
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
            >
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                leftIcon={<User className="w-5 h-5" />}
              />
            </motion.div>
          )}

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            leftIcon={<Mail className="w-5 h-5" />}
            hint="Must be a valid .edu email address"
          />

          {/* Error Message */}
          {error && <Alert message={error} variant="error" />}

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
                Don&apos;t have an account?{' '}
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

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--uw-purple)] border-t-transparent" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
