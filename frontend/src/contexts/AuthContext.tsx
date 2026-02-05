'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { userApi, contributorApi } from '@/lib/api';
import type { ContributorStatus } from '@/lib/api';

// Pending action types for post-login execution
export interface PendingAction {
  type: 'rsvp';
  eventId: string;
  status: 'going' | 'interested';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  netid: string | null;
  isContributor: boolean;
  isAdmin: boolean;
  contributorStatus: ContributorStatus | null;
  pendingAction: PendingAction | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshContributorStatus: () => Promise<void>;
  setPendingAction: (action: PendingAction | null) => void;
  executePendingAction: () => Promise<PendingAction | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PENDING_ACTION_KEY = 'pendingAction';
const REDIRECT_URL_KEY = 'authRedirectUrl';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contributorStatus, setContributorStatus] = useState<ContributorStatus | null>(null);
  const [pendingAction, setPendingActionState] = useState<PendingAction | null>(null);
  const supabase = createClient();

  // Derived values
  const netid = user?.email?.split('@')[0] || null;
  const isContributor = contributorStatus?.is_contributor ?? false;
  const isAdmin = contributorStatus?.is_admin ?? false;

  // Load pending action from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PENDING_ACTION_KEY);
      if (stored) {
        try {
          setPendingActionState(JSON.parse(stored));
        } catch {
          localStorage.removeItem(PENDING_ACTION_KEY);
        }
      }
    }
  }, []);

  // Set pending action and persist to localStorage
  const setPendingAction = useCallback((action: PendingAction | null) => {
    setPendingActionState(action);
    if (typeof window !== 'undefined') {
      if (action) {
        localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
      } else {
        localStorage.removeItem(PENDING_ACTION_KEY);
      }
    }
  }, []);

  // Execute pending action and clear it
  const executePendingAction = useCallback(async (): Promise<PendingAction | null> => {
    const action = pendingAction;
    if (action) {
      setPendingAction(null);
    }
    return action;
  }, [pendingAction, setPendingAction]);

  // Fetch contributor status for a user
  const fetchContributorStatus = useCallback(async (userNetid: string) => {
    try {
      const status = await contributorApi.getStatus(userNetid);
      setContributorStatus(status);
    } catch (error) {
      console.error('Failed to fetch contributor status:', error);
      setContributorStatus({
        is_contributor: false,
        is_admin: false,
        pending_request: null,
        requests: []
      });
    }
  }, []);

  // Public method to refresh contributor status
  const refreshContributorStatus = useCallback(async () => {
    if (netid) {
      await fetchContributorStatus(netid);
    }
  }, [netid, fetchContributorStatus]);

  const syncUserToDatabase = async (authUser: User) => {
    try {
      const userNetid = authUser.email?.split('@')[0] || authUser.id;
      const existsResponse = await userApi.exists(userNetid);

      if (!existsResponse.exists) {
        await userApi.create({
          netid: userNetid,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
        });
      }

      // Fetch contributor status after sync
      await fetchContributorStatus(userNetid);
    } catch (error) {
      console.error('Failed to sync user to database:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Fetch contributor status if user is logged in
      if (session?.user) {
        const userNetid = session.user.email?.split('@')[0];
        if (userNetid) {
          fetchContributorStatus(userNetid);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // On sign up/in, sync user to database
        if (event === 'SIGNED_IN' && session?.user) {
          await syncUserToDatabase(session.user);
        }

        // Clear contributor status on sign out
        if (event === 'SIGNED_OUT') {
          setContributorStatus(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  const signInWithGoogle = async (redirectTo?: string) => {
    const finalRedirect = redirectTo || '/explore';

    // Store redirect URL in localStorage as backup (Supabase sometimes loses query params)
    if (typeof window !== 'undefined') {
      localStorage.setItem(REDIRECT_URL_KEY, finalRedirect);
    }

    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', finalRedirect);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        netid,
        isContributor,
        isAdmin,
        contributorStatus,
        pendingAction,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshContributorStatus,
        setPendingAction,
        executePendingAction,
      }}
    >
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
