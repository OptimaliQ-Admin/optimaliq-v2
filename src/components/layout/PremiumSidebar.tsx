// File: /src/components/layout/PremiumSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import {
  ChartBarIcon,
  RocketLaunchIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/premium/dashboard", icon: <ChartBarIcon className="w-5 h-5" />, label: "Dashboard" },
  { href: "/premium/growth-studio", icon: <RocketLaunchIcon className="w-5 h-5" />, label: "Growth Studio" },
  { href: "/premium/assessment", icon: <PencilSquareIcon className="w-5 h-5" />, label: "Assessment" },
];

export default function PremiumSidebar() {
  const { user } = usePremiumUser();
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "bg-optimaliq text-white h-screen transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <h2
          className={cn(
            "font-bold text-white text-lg transition-opacity duration-200",
            collapsed && "opacity-0 invisible"
          )}
        >
          OptimaliQ
        </h2>
        <Menu className={cn("h-5 w-5 text-white transition-transform duration-200", collapsed && "rotate-90")} />
      </div>

      <nav className="flex-1 px-2 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className="w-full flex items-center p-2 rounded-md hover:bg-optimaliq-dark transition-colors"
          >
            <span className="mr-3 text-white">{item.icon}</span>
            <span className={cn("text-sm font-semibold transition-opacity duration-200", collapsed && "opacity-0 invisible")}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-optimaliq-dark text-xs text-white/70">
        {!collapsed && <span>{user?.email || "Logged In"}</span>}
      </div>
    </aside>
  );
}
