// File: /src/components/layout/PremiumHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { usePremiumUser } from "@/context/PremiumUserContext";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function PremiumHeader() {
  const { user, logout } = usePremiumUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      router.push("/");
    } finally {
      setIsLoggingOut(false);
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
        <div className="flex items-center gap-4">
          <NotificationBell />
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            {user?.profile_pic_url ? (
              <Image 
                src={user.profile_pic_url} 
                alt={`${user?.first_name || user?.email || 'User'} profile picture`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-300" 
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-400 border-2 border-gray-300">
                {user?.first_name?.[0] || user?.email?.[0] || '?'}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">
              {user?.email || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <Link href="/premium/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
