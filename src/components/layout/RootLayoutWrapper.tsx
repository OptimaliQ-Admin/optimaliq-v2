"use client";

import Navbar from "./Navbar";

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {children}
      </main>
    </>
  );
}
