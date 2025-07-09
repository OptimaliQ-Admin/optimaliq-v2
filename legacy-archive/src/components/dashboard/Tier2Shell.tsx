//src/components/dashboard/Tier2Shell.tsx
"use client";

import React from "react";

export default function Tier2Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {children}
      </main>
    </div>
  );
}
