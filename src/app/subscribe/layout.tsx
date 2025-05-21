"use client";

import { PremiumUserProvider } from "@/context/PremiumUserContext";
import Navbar from "@/components/layout/Navbar";

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PremiumUserProvider>
      <Navbar />
      {children}
    </PremiumUserProvider>
  );
}
