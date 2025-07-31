import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  email?: string;
  isPremium: boolean;
}

export function usePremiumUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('🔍 usePremiumUser: Starting to fetch user...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ usePremiumUser: Auth session error:', error);
          throw error;
        }

        console.log('🔍 usePremiumUser: Session data:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          userEmail: session?.user?.email 
        });

        if (session?.user) {
          // Check if user has premium access by checking subscription status
          const { data: subscription, error: subscriptionError } = await supabase
            .from("subscriptions")
            .select("status")
            .eq("user_id", session.user.id)
            .single();

          console.log('🔍 usePremiumUser: Subscription data:', { 
            subscription, 
            subscriptionError,
            status: subscription?.status 
          });

          const isPremium = subscription?.status === "active" || subscription?.status === "trial";

          const userData = {
            id: session.user.id,
            email: session.user.email,
            isPremium: isPremium || false,
          };

          console.log('✅ usePremiumUser: Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('❌ usePremiumUser: No session user found');
        }
      } catch (error) {
        console.error("❌ usePremiumUser: Error fetching user:", error);
      } finally {
        console.log('🏁 usePremiumUser: Setting loading to false');
        setLoading(false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
} 