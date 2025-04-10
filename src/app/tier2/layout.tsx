// src/app/tier2/layout.tsx
"use client";

import Tier2Header from "@/components/layout/Tier2Header";
import Tier2Sidebar from "@/components/layout/sidebar";

export default function Tier2Layout({
  children,
  email, // <-- Add email prop
}: {
  children: React.ReactNode;
  email: string; // <-- Define prop type here
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Tier2Sidebar email={email} />
      <div className="flex flex-col flex-1">
        <Tier2Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
