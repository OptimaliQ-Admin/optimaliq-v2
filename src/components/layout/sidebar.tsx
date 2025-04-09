// File: /src/components/layout/Sidebar.tsx

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional classNames
import { Menu } from "lucide-react";

const navItems = [
  { href: "/tier2/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/tier2/insights", icon: "📑", label: "Insights" },
  { href: "/tier2/assessment", icon: "📝", label: "Assessment" },
  { href: "#", icon: "👥", label: "Community" },
];

export default function Sidebar({ email }: { email: string }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "bg-white shadow-lg h-screen transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <h2
          className={cn(
            "font-bold text-gray-800 text-lg transition-opacity duration-200",
            collapsed && "opacity-0 invisible"
          )}
        >
          GMF+
        </h2>
        <Menu
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform duration-200",
            collapsed && "rotate-90"
          )}
        />
      </div>

      <nav className="flex-1 px-2 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span
              className={cn(
                "text-sm font-medium transition-opacity duration-200",
                collapsed && "opacity-0 invisible"
              )}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t text-xs text-gray-500">
        {!collapsed && <span>{email}</span>}
      </div>
    </aside>
  );
}
