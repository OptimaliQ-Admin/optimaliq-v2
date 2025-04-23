"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#key-features" },
    { label: "FAQ", href: "/#faq" },
    { label: "Subscribe", href: "/subscribe" },
  ];

  return (
    <nav className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          OptimaliQ
        </Link>
        <ul className="hidden md:flex space-x-6 text-gray-800 dark:text-white text-md">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`hover:text-blue-600 transition ${
                  pathname === href ? "text-blue-700 font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard/Page1"
          className="hidden md:inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition"
        >
          Launch Audit
        </Link>
      </div>
    </nav>
  );
}
