"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { performLogout } from "@/lib/utils/auth";

// Types from your users table
export type PremiumUser = {
  id: string;
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

export type SubscriptionData = {
  status: string;
  plan: string;
  billingCycle: string;
  nextBillingDate: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  amount: number;
  currency: string;
};

type ContextType = {
  user: PremiumUser | null;
  setUser: (user: PremiumUser | null) => void;
  isUserLoaded: boolean;
  subscription: SubscriptionData | null;
  isSubscriptionLoaded: boolean;
  refreshSubscription: () => Promise<void>;
  logout: () => Promise<void>;
};

const PremiumUserContext = createContext<ContextType>({
  user: null,
  setUser: () => {},
  isUserLoaded: false,
  subscription: null,
  isSubscriptionLoaded: false,
  refreshSubscription: async () => {},
  logout: async () => {},
});

export const PremiumUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PremiumUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isSubscriptionLoaded, setIsSubscriptionLoaded] = useState(false);

  // Fetch subscription data
  const fetchSubscription = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/premium/account/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        console.error('Failed to fetch subscription data');
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setIsSubscriptionLoaded(true);
    }
  }, []);

  // Refresh subscription data
  const refreshSubscription = useCallback(async () => {
    if (user?.id) {
      await fetchSubscription(user.id);
    }
  }, [user?.id, fetchSubscription]);

  // Centralized logout function using the auth utility
  const logout = useCallback(async () => {
    try {
      // Use the comprehensive logout utility
      await performLogout();
      
      // Clear React context
      setUser(null);
      setSubscription(null);
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if cleanup fails, clear context
      setUser(null);
      setSubscription(null);
    }
  }, []);

  // Load user from localStorage once on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tier2_user");
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);
        // Fetch subscription data for the user
        if (userData?.id) {
          fetchSubscription(userData.id);
        }
      }
    } catch (err) {
      console.warn("❌ Failed to load cached Premium user.");
    } finally {
      setIsUserLoaded(true);
    }
  }, [fetchSubscription]);

  // Keep user cached in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("tier2_user", JSON.stringify(user));
      // Fetch subscription data when user changes
      fetchSubscription(user.id);
    } else {
      localStorage.removeItem("tier2_user");
      setSubscription(null);
      setIsSubscriptionLoaded(false);
    }
  }, [user, fetchSubscription]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear everything when user signs out
          setUser(null);
          setSubscription(null);
          setIsSubscriptionLoaded(false);
          localStorage.clear();
          sessionStorage.clear();
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Handle sign in - user will be set via login flow
          console.log("User signed in successfully");
        }
      }
    );

    return () => authSubscription.unsubscribe();
  }, []);

  return (
    <PremiumUserContext.Provider value={{ 
      user, 
      setUser, 
      isUserLoaded, 
      subscription,
      isSubscriptionLoaded,
      refreshSubscription,
      logout 
    }}>
      {children}
    </PremiumUserContext.Provider>
  );
};

// Use in components
export const usePremiumUser = () => useContext(PremiumUserContext);
