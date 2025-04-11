//src/app/tier2/layout.tsx
"use client";

import Tier2Header from "@/components/layout/Tier2Header";
import Tier2Sidebar from "@/components/layout/sidebar";
import { Tier2UserProvider } from "@/context/Tier2UserContext";

export default function Tier2Layout({ children }: { children: React.ReactNode }) {
  const email = "user@example.com"; // TODO: Replace with dynamic email from context or props

  return (
    <Tier2UserProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <Tier2Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Tier2Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </Tier2UserProvider>
  );
}