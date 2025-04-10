// File: /src/components/layout/Tier2Header.tsx

"use client";

import Link from "next/link";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Tier2Header({ userEmail }: { userEmail?: string }) {
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
          {/* Optional: Notification dot */}
          {/* <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span> */}
        </button>

        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
          <span className="text-sm text-gray-700 font-medium">
            {userEmail || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
