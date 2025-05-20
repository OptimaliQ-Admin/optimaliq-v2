// File: /src/components/layout/PremiumHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { supabase } from "@/lib/supabase";

export default function PremiumHeader() {
  const { user } = usePremiumUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <UserCircleIcon className="h-6 w-6 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">
              {user?.email || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
