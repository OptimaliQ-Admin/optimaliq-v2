// File: refactor/src/context/PremiumUserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
};

const PremiumUserContext = createContext<{
  user: PremiumUser | null;
  setUser: React.Dispatch<React.SetStateAction<PremiumUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const PremiumUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PremiumUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("tier2_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

export const usePremiumUser = () => useContext(PremiumUserContext);
