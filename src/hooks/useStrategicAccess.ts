import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { usePremiumUser } from "@/context/PremiumUserContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface StrategicAccess {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
}

export function useStrategicAccess(): StrategicAccess {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: premiumUser, subscription } = usePremiumUser();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        setError(null);

        let userId: string | null = null;

        // First try to get user ID from PremiumUserContext
        if (premiumUser?.u_id) {
          userId = premiumUser.u_id;
          console.log("🔍 Using user ID from PremiumUserContext:", userId);
        } else {
          // Fallback to Supabase auth session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (!session?.user) {
            console.log("🔍 No Supabase session found");
            setHasAccess(false);
            return;
          }

          userId = session.user.id;
          console.log("🔍 Using user ID from Supabase session:", userId);
        }

        if (!userId) {
          console.log("🔍 No user ID found from either source");
          setHasAccess(false);
          return;
        }

        // Check if user has Strategic subscription - filter by specific user ID
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("plan, status, u_id")
          .eq("u_id", userId)
          .eq("status", "active");

        console.log("📊 Subscription query result:", { subscriptions, subscriptionError });

        if (subscriptionError) {
          console.error("❌ Subscription query error:", subscriptionError);
          throw subscriptionError;
        }

        // Check if any of the user's active subscriptions are strategic
        const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;
        
        console.log("✅ Strategic access result:", { 
          subscriptions: subscriptions,
          hasAccess: hasStrategicAccess 
        });
        
        setHasAccess(hasStrategicAccess);

      } catch (error: any) {
        console.error("Error checking Strategic access:", error);
        setError(error.message);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAccess();
      } else {
        setHasAccess(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [premiumUser?.u_id, subscription]);

  return { hasAccess, loading, error };
} 