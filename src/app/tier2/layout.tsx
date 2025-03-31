// File: /src/app/tier2/layout.tsx

"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptimaliQ | Tier 2",
  description: "Tier 2 Dashboard & Assessment for OptimaliQ",
};

export default function Tier2Layout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {/* 👇 No Header/Footer */}
      <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
    </SessionContextProvider>
  );
}
