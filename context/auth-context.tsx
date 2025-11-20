"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from "next/navigation" // Import useRouter
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsLoggedIn(!!session);

        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profile) {
            setIsAdmin(profile.role === 'admin');
          }
        }
      } catch (e) {
        console.error("Error initializing auth session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setIsLoggedIn(!!newSession);
        if (newSession) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', newSession.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profile) {
            setIsAdmin(profile.role === 'admin');
          }
        } else {
          setIsAdmin(false);
        }
        setIsLoading(false); // Ensure loading is false after any auth state change
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = () => {
    // This function will typically redirect to the login page or trigger a modal
    // For now, it's a placeholder. The actual sign-in happens on the login page.
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
      setIsLoggedIn(false);
      setIsAdmin(false);
      alert("You have been logged out.");
      router.push('/login'); // Redirect to login page after logout
    }
    setIsLoading(false);
  };


  return (
    <AuthContext.Provider value={{ session, isLoggedIn, isAdmin, isLoading, signIn, signOut }}>
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
