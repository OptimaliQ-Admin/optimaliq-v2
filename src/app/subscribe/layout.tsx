"use client";

import { PremiumUserProvider } from "@/context/PremiumUserContext";

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PremiumUserProvider>
      {children}
    </PremiumUserProvider>
  );
}
