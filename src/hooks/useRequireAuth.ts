// src/hooks/useRequireAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function useRequireAuth() {
  const router = useRouter();
  const supabase = createPagesBrowserClient();
  const [checking, setChecking] = useState(true); // 🌀 optional loading

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn("No session found, redirecting...");
        router.push("/subscribe/login");
      } else {
        console.log("✅ Session active.");
      }
      setChecking(false);
    };

    checkAuth();
  }, []);

  return { checking }; // return loading state
}
