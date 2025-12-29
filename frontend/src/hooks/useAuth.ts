'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { AuthState, UserProfile } from '@/types';
import { isValidEduEmail } from '@/lib/emailUtils';

const AUTH_KEY = 'dubai-auth';
const PROFILE_KEY = 'dubai-user-profile';

// Default state when not logged in
const DEFAULT_AUTH: AuthState = {
  isAuth: false,
  id: null,
  email: null,
  role: 'user',
};

export function useAuth() {
  const [auth, setAuthState] = useState<AuthState>(DEFAULT_AUTH);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load auth state on mount
  useEffect(() => {
    (async () => {
    const saved = await storage.get<AuthState>(AUTH_KEY);
    if (saved) {
        setAuthState(saved);
    }
    setIsLoaded(true);
    })();
  }, []);

  // Login function
  const login = useCallback(async (email: string) => {
    // Validate email ends with .edu
    if (!isValidEduEmail(email)) {
        throw new Error('Must be an .edu email')
    }

    // Check if account exists
    const existingAuth = await storage.get<AuthState>(AUTH_KEY);
    if (!existingAuth || existingAuth.email !== email) {
        throw new Error('Account not found. Please sign up first.');
    }

    // Set auth state from existing account
    setAuthState(existingAuth);
  }, []);


  // Signup function
  const signup = useCallback(async (name: string, email: string) => {
    if (!isValidEduEmail(email)) {
        throw new Error('Must be an .edu email')
    }

    // Check if account already exists
    const existingAuth = await storage.get<AuthState>(AUTH_KEY);
    if (existingAuth && existingAuth.email === email) {
        throw new Error('Account already exists. Please sign in instead.');
    }

    const newAuth: AuthState = {
        isAuth: true,
        id: crypto.randomUUID(),
        email: email,
        role: 'user',
    };

    // Store auth state
    await storage.set(AUTH_KEY, newAuth);
    setAuthState(newAuth);

    // Create initial profile with name and email
    const organizationId = email.endsWith('@uw.edu') ? 'uw-seattle' : 'uw-seattle';
    const initialProfile: Partial<UserProfile> = {
        id: newAuth.id!,
        name: name,
        email: email,
        organizationId: organizationId,
        tags: [],
    };

    // Store initial profile
    await storage.set(PROFILE_KEY, initialProfile);

    return {
        userId: newAuth.id,
        email: newAuth.email,
        name: name
    };
  }, []);

  /**
   * Logout the current user
   * @returns void
   * @behavior Clears all storage and resets auth state
   */
  const logout = useCallback(async () => {
    await storage.clear();
    setAuthState(DEFAULT_AUTH);
  }, []);

  return { auth, isLoaded, login, signup, logout };
}
