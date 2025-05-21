//src/app/premium/layout.tsx
"use client";

import { Suspense } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import PremiumSidebar from "@/components/layout/PremiumSidebar";
import PremiumHeader from "@/components/layout/PremiumHeader";
import { RouteLoadingProvider } from "@/context/RouteLoadingContext";

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = usePremiumUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please log in to access premium features.</p>
      </div>
    );
  }

  return (
    <RouteLoadingProvider>
      <div className="flex h-screen bg-gray-100">
        <PremiumSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PremiumHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
        </div>
      </div>
    </RouteLoadingProvider>
  );
}

