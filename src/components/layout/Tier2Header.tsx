// File: /src/components/layout/Tier2Header.tsx
"use client";

import Link from "next/link";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTier2User } from "@/context/Tier2UserContext";

export default function Tier2Header() {
  const { user } = useTier2User();

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-40">
      {/* Left: Logo */}
      <Link href="/tier2/dashboard" className="text-xl font-bold text-blue-600 hover:opacity-80">
        OptimaliQ
      </Link>

      {/* Right: Notification + User */}
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
