// File: /src/components/layout/PremiumHeader.tsx
"use client";

import Link from "next/link";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { usePremiumUser } from "@/context/PremiumUserContext";

export default function PremiumHeader() {
  const { user } = usePremiumUser();

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-40">
      {/* Logo + Tagline */}
      <Link href="/premium/dashboard" className="flex items-center space-x-2 text-xl font-bold text-blue-700 hover:opacity-80">
        <span>OptimaliQ</span>
        <span className="text-xs font-medium text-blue-500 bg-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wide">Premium</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        <button className="relative">
          <BellIcon className="h-5 w-5 text-gray-600 hover:text-blue-600 transition" />
        </button>

        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
          <span className="text-sm text-gray-700 font-medium">
            {user?.email || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
