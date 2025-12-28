'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { AuthState } from '@/types';

const AUTH_KEY = 'dubai-auth';

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
    const validEmail = email.endsWith(".edu");

    if (!validEmail) {
        throw new Error('Must be an .edu email')
    }

    const newAuth: AuthState = {
        isAuth: true,
        id: crypto.randomUUID(),
        email: email,
        role: 'user',
    };

    await storage.set(AUTH_KEY, newAuth);
    setAuthState(newAuth);
  }, []);


  // Signup function  
  const signup = useCallback(async (name: string, email: string) => {
    const validEmail = email.endsWith(".edu");

    if (!validEmail) {
        throw new Error('Must be an .edu email')
    }

    const newAuth: AuthState = {
        isAuth: true,
        id: crypto.randomUUID(),
        email: email,
        role: 'user',
    }; 

    await storage.set(AUTH_KEY, newAuth);
    setAuthState(newAuth);

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
