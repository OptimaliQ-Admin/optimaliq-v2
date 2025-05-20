"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface PremiumUser extends User {
  u_id: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  company?: string;
  profile_pic_url?: string;
  phone?: string;
  subscription_status?: string;
}

interface PremiumUserContextType {
  user: PremiumUser | null;
  loading: boolean;
  error: string | null;
}

const PremiumUserContext = createContext<PremiumUserContextType | null>(null);

export function PremiumUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PremiumUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch additional user data from tier2_users table
        supabase
          .from('tier2_users')
          .select('*')
          .eq('u_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user data:', error);
              setError(error.message);
            } else if (data) {
              setUser({ ...session.user, ...data } as PremiumUser);
            }
          });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch additional user data from tier2_users table
        const { data, error } = await supabase
          .from('tier2_users')
          .select('*')
          .eq('u_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setError(error.message);
        } else if (data) {
          setUser({ ...session.user, ...data } as PremiumUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PremiumUserContext.Provider value={{ user, loading, error }}>
      {children}
    </PremiumUserContext.Provider>
  );
}

export { PremiumUserContext };

// ✅ Use in components
export const usePremiumUser = () => useContext(PremiumUserContext);
