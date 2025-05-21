//src/app/premium/layout.tsx
"use client";

import { PremiumUserProvider } from "@/context/PremiumUserContext";
import PremiumHeader from "@/components/layout/PremiumHeader";
import PremiumSidebar from "@/components/layout/PremiumSidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth(); // get checking status

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
        <PremiumSidebar />
        <div className="flex flex-col flex-1">
          <PremiumHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </PremiumUserProvider>
  );
}

