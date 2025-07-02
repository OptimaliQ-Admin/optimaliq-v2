import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          setHasAccess(false);
          return;
        }

        // Check if user has Strategic subscription
        const { data: subscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("u_id", session.user.id)
          .eq("status", "active")
          .single();

        if (subscriptionError) {
          throw subscriptionError;
        }

        setHasAccess(subscription?.plan === 'strategic');

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
  }, []);

  return { hasAccess, loading, error };
} 