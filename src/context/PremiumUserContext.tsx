"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { performLogout } from "@/lib/utils/auth";

// Types from your tier2_users table
export type PremiumUser = {
  u_id: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  industry: string;
  company_size: string;
  revenue_range: string;
  timezone?: string;
  linkedin_url?: string;
  agreed_terms?: boolean;
  agreed_marketing?: boolean;
  profile_pic_url?: string;
  phone?: string;
};

type ContextType = {
  user: PremiumUser | null;
  setUser: (user: PremiumUser | null) => void;
  isUserLoaded: boolean;
  logout: () => Promise<void>;
};

const PremiumUserContext = createContext<ContextType>({
  user: null,
  setUser: () => {},
  isUserLoaded: false,
  logout: async () => {},
});

export const PremiumUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PremiumUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Centralized logout function using the auth utility
  const logout = useCallback(async () => {
    try {
      // Use the comprehensive logout utility
      await performLogout();
      
      // Clear React context
      setUser(null);
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if cleanup fails, clear context
      setUser(null);
    }
  }, []);

  // Load user from localStorage once on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tier2_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("❌ Failed to load cached Premium user.");
    } finally {
      setIsUserLoaded(true);
    }
  }, []);

  // Keep user cached in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("tier2_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tier2_user");
    }
  }, [user]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear everything when user signs out
          setUser(null);
          localStorage.clear();
          sessionStorage.clear();
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Handle sign in - user will be set via login flow
          console.log("User signed in:", session.user.email);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <PremiumUserContext.Provider value={{ user, setUser, isUserLoaded, logout }}>
      {children}
    </PremiumUserContext.Provider>
  );
};

// Use in components
export const usePremiumUser = () => useContext(PremiumUserContext);
