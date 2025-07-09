//src/app/premium/layout.tsx
"use client";

import { PremiumUserProvider, usePremiumUser } from "@/context/PremiumUserContext";
import PremiumHeader from "@/components/layout/PremiumHeader";
import PremiumSidebar from "@/components/layout/PremiumSidebar";
import SubscriptionStatusBanner from "@/components/shared/SubscriptionStatusBanner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { usePathname } from "next/navigation";

function PremiumLayoutContent({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth(); // get checking status
  const { subscription, isSubscriptionLoaded } = usePremiumUser();
  const pathname = usePathname();

  // Check if we're in onboarding flow
  const isOnboarding = pathname?.startsWith("/premium/onboarding");
  
  // Check if this is an assessment invitation (skip auth check)
  const isAssessmentInvitation = pathname?.startsWith("/premium/assessment/") && 
    typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('invitation');

  // Skip auth check for assessment invitations
  if (isAssessmentInvitation) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        {children}
      </main>
    );
  }

  if (checking || !isSubscriptionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Subscription Status Banner */}
      <SubscriptionStatusBanner 
        subscriptionStatus={subscription?.status}
      />
      
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        {!isOnboarding && <PremiumSidebar />}
        <div className="flex flex-col flex-1">
          {!isOnboarding && <PremiumHeader />}
          <main className={`flex-1 overflow-y-auto ${!isOnboarding ? 'p-6' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <PremiumUserProvider>
      <PremiumLayoutContent>
        {children}
      </PremiumLayoutContent>
    </PremiumUserProvider>
  );
}

