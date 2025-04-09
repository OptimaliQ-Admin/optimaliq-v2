"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Optional utility for conditional classnames

const navItems = [
  { href: "/tier2/dashboard", label: "📊 Dashboard" },
  { href: "/tier2/insights", label: "📑 Insights" },
  { href: "/tier2/assessment", label: "📝 Assessment" },
  { href: "#", label: "👥 Community" },
];

export default function Sidebar({ email }: { email: string }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={cn(
        "bg-white shadow-lg h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4">
        <h2 className={cn("font-bold text-gray-800 transition-opacity", collapsed && "opacity-0")}>
          GMF+
        </h2>
      </div>

      <nav className="space-y-4 px-4">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block text-gray-700 hover:text-blue-600 font-medium"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 text-gray-500 text-sm">
        {!collapsed && <span>{email}</span>}
      </div>
    </aside>
  );
}
