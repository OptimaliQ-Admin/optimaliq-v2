"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-optimaliq">OptimaliQ</span>
            </Link>
          </div>

          <ul className="hidden md:flex space-x-6 text-gray-800 text-md">
            <li>
              <Link
                href="/pricing"
                className={cn(
                  "hover:text-optimaliq transition-colors",
                  pathname === "/pricing" && "text-optimaliq font-semibold"
                )}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/subscribe"
                className="bg-optimaliq text-white px-4 py-2 rounded-md hover:bg-optimaliq-dark transition-colors"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
