//src/app/premium/layout.tsx
"use client";

import { PremiumUserProvider } from "@/context/PremiumUserContext";
import PremiumHeader from "@/components/layout/PremiumHeader";
import PremiumSidebar from "@/components/layout/PremiumSidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { usePathname } from "next/navigation";

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth(); // get checking status
  const pathname = usePathname();

  // Check if we're in onboarding flow
  const isOnboarding = pathname?.startsWith("/premium/onboarding");

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PremiumUserProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        {!isOnboarding && <PremiumSidebar />}
        <div className="flex flex-col flex-1">
          {!isOnboarding && <PremiumHeader />}
          <main className={`flex-1 overflow-y-auto ${!isOnboarding ? 'p-6' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </PremiumUserProvider>
  );
}

