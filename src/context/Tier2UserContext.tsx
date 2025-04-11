// src/context/Tier2UserContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

export type Tier2User = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  industry: string;
};

const Tier2UserContext = createContext<{
  user: Tier2User | null;
  setUser: React.Dispatch<React.SetStateAction<Tier2User | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const Tier2UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Tier2User | null>(null);
  return (
    <Tier2UserContext.Provider value={{ user, setUser }}>
      {children}
    </Tier2UserContext.Provider>
  );
};

export const useTier2User = () => useContext(Tier2UserContext);
