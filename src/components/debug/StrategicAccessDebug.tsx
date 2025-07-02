"use client";

import { useStrategicAccess } from "@/hooks/useStrategicAccess";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SessionInfo {
  session: any;
  sessionError: any;
}

interface SubscriptionInfo {
  subscription: any;
  subscriptionError: any;
}

export default function StrategicAccessDebug() {
  const { hasAccess, loading, error } = useStrategicAccess();
  const { user: premiumUser, subscription: contextSubscription } = usePremiumUser();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    const debugAccess = async () => {
      try {
        // Get session info
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        setSessionInfo({ session, sessionError });

        // Get user ID from either source
        const userId = premiumUser?.u_id || session?.user?.id;

        if (userId) {
          // Get subscription info directly
          const { data: subscription, error: subscriptionError } = await supabase
            .from("subscriptions")
            .select("plan, status, u_id")
            .eq("u_id", userId)
            .eq("status", "active")
            .single();
          
          setSubscriptionInfo({ subscription, subscriptionError });
        }
      } catch (error) {
        console.error("Debug error:", error);
      }
    };

    debugAccess();
  }, [premiumUser?.u_id]);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Strategic Access Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Hook Status:</strong>
          <div className="ml-2">
            <div>Loading: {loading ? "Yes" : "No"}</div>
            <div>Has Access: {hasAccess ? "Yes" : "No"}</div>
            {error && <div className="text-red-500">Error: {error}</div>}
          </div>
        </div>

        <div>
          <strong>PremiumUserContext:</strong>
          <div className="ml-2">
            <div>User ID: {premiumUser?.u_id || "None"}</div>
            <div>Email: {premiumUser?.email || "None"}</div>
            <div>Plan: {contextSubscription?.plan || "None"}</div>
            <div>Status: {contextSubscription?.status || "None"}</div>
          </div>
        </div>

        <div>
          <strong>Supabase Session:</strong>
          <div className="ml-2">
            <div>User ID: {sessionInfo?.session?.user?.id || "None"}</div>
            <div>Email: {sessionInfo?.session?.user?.email || "None"}</div>
          </div>
        </div>

        <div>
          <strong>Direct DB Query:</strong>
          <div className="ml-2">
            <div>Plan: {subscriptionInfo?.subscription?.plan || "None"}</div>
            <div>Status: {subscriptionInfo?.subscription?.status || "None"}</div>
            <div>U_ID: {subscriptionInfo?.subscription?.u_id || "None"}</div>
            {subscriptionInfo?.subscriptionError && (
              <div className="text-red-500">Error: {subscriptionInfo.subscriptionError.message}</div>
            )}
          </div>
        </div>

        <div>
          <strong>Expected:</strong>
          <div className="ml-2">
            <div>Plan should be: &quot;strategic&quot;</div>
            <div>Status should be: &quot;active&quot;</div>
            <div>U_ID should match session user ID</div>
          </div>
        </div>
      </div>
    </div>
  );
} 