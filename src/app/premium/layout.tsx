// refactor/src/app/premium/layout.tsx
"use client";

import { PremiumUserProvider } from "@/context/PremiumUserContext";
import PremiumHeader from "@/components/layout/PremiumHeader";
import PremiumSidebar from "@/components/layout/PremiumSidebar";

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <PremiumUserProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        <PremiumSidebar />
        <div className="flex flex-col flex-1">
          <PremiumHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </PremiumUserProvider>
  );
}
