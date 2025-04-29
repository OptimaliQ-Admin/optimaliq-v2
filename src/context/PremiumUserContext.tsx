//src/context/PremiumUserContext.tsx
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
};

type ContextType = {
  user: PremiumUser | null;
  setUser: (user: PremiumUser | null) => void;
};

const PremiumUserContext = createContext<ContextType>({
  user: null,
  setUser: () => {},
});

export const PremiumUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PremiumUser | null>(null);

  // ✅ Load user from localStorage once on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tier2_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("❌ Failed to load cached Premium user.");
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
    <PremiumUserContext.Provider value={{ user, setUser }}>
      {children}
    </PremiumUserContext.Provider>
  );
};

// ✅ Use in components
export const usePremiumUser = () => useContext(PremiumUserContext);
