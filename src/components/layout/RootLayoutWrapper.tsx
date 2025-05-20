"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = !pathname?.startsWith("/premium") && !pathname?.startsWith("/subscribe");

  return (
    <>
      {isPublicRoute && <Navbar />}
      <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {children}
      </main>
    </>
  );
}
