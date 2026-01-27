'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { userApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  netid: string | null; // User's netid (email prefix) for backend API calls
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // On sign up, create user in database
        if (event === 'SIGNED_IN' && session?.user) {
          await syncUserToDatabase(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const syncUserToDatabase = async (authUser: User) => {
    try {
      const netid = authUser.email?.split('@')[0] || authUser.id;
      const existsResponse = await userApi.exists(netid);

      if (!existsResponse.exists) {
        await userApi.create({
          netid,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
        });
      }
    } catch (error) {
      console.error('Failed to sync user to database:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Derive netid from user's email
  const netid = user?.email?.split('@')[0] || null;

  return (
    <AuthContext.Provider value={{ user, session, isLoading, netid, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
