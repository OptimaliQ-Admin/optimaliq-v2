"use client";

import { usePathname } from "next/navigation";
import { Tier2UserProvider } from "@/context/Tier2UserContext";

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTier2 = pathname.startsWith("/tier2") || pathname === "/login";


  const content = isTier2 ? (
    <Tier2UserProvider>
      {children}
    </Tier2UserProvider>
  ) : (
    children
  );
  

  return (
    <div className="min-h-screen flex flex-col">
      {!isTier2 && (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-6 py-4 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/Homepage" className="text-xl font-bold text-blue-600">OptimaliQ</a>
            <div className="flex space-x-6">
              <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
              <a href="#key-features" className="hover:text-blue-600">Key Features</a>
              <a href="#faq" className="hover:text-blue-600">FAQ</a>
              <a href="/Pricing" className="hover:text-blue-600">Pricing</a>
            </div>
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sign In
            </a>
          </div>
        </nav>
      )}

      <main className={`${!isTier2 ? "pt-16" : ""} flex-grow`}>
        {content}
      </main>

      {!isTier2 && (
        <footer className="bg-gray-900 text-white text-center py-6 mt-10">
          <p>© {new Date().getFullYear()} OptimaliQ.ai. All Rights Reserved.</p>
        </footer>
      )}
    </div>
  );
}
