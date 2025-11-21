"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from "next/navigation" // Import useRouter
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthTokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

interface AuthContextType {
  session: Session | null;
  authToken: AuthTokenData | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // Initialize useRouter
  const [session, setSession] = useState<Session | null>(null);
  const [authToken, setAuthToken] = useState<AuthTokenData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processSession = async (currentSession: Session | null) => {
      setSession(currentSession);
      setIsLoggedIn(!!currentSession);

      if (currentSession) {
        setAuthToken({
          accessToken: currentSession.access_token,
          refreshToken: currentSession.refresh_token,
          expiresIn: currentSession.expires_in,
          tokenType: currentSession.token_type,
        });

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profile) {
            setIsAdmin(profile.role === 'admin');
          }
        } catch (err: any) {
          console.error("Error fetching profile async:", err);
        }
      } else {
        setAuthToken(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        processSession(session);
      } catch (e: any) {
        console.error("Error initializing auth session:", e);
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        processSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = () => {
    console.log("Sign-in initiated (redirect to login page)");
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during sign out:", error);
      alert(`Logout Error: ${error.message}`);
    } else {
      setSession(null);
      setAuthToken(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      alert("You have been logged out.");
      router.push('/login'); // Redirect to login page after logout
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, authToken, isLoggedIn, isAdmin, isLoading, signIn, signOut }}>
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
