"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
  isUserLoaded: boolean; // ✅ add this
};

const PremiumUserContext = createContext<ContextType>({
  user: null,
  setUser: () => {},
  isUserLoaded: false, // ✅ default false
});

export const PremiumUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PremiumUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false); // ✅ new

  // ✅ Load user from localStorage once on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tier2_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("❌ Failed to load cached Premium user.");
    } finally {
      setIsUserLoaded(true); // ✅ mark as loaded no matter what
    }
  }, []);

  // ✅ Keep user cached in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("tier2_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tier2_user");
    }
  }, [user]);

  return (
    <PremiumUserContext.Provider value={{ user, setUser, isUserLoaded }}>
      {children}
    </PremiumUserContext.Provider>
  );
};

// ✅ Use in components
export const usePremiumUser = () => useContext(PremiumUserContext);
