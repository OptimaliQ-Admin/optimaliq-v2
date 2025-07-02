import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";

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

        if (!premiumUser?.u_id) {
          console.log("🔍 No user ID from PremiumUserContext");
          setHasAccess(false);
          return;
        }

        console.log("🔍 Using user ID from PremiumUserContext:", premiumUser.u_id);

        // Use server-side API call to bypass RLS policies
        const response = await fetch('/api/premium/auth/checkStrategicAccess', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            u_id: premiumUser.u_id
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Strategic access API result:", data);
        
        setHasAccess(data.hasAccess || false);

      } catch (error: any) {
        console.error("Error checking Strategic access:", error);
        setError(error.message);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [premiumUser?.u_id]);

  return { hasAccess, loading, error };
} 