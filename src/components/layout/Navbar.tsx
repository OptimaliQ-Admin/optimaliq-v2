"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#key-features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Subscribe", href: "/subscribe" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700" aria-label="OptimaliQ logo - AI-powered business growth insights">
          OptimaliQ
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-gray-800 text-md">
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

        {/* Desktop Sign In Button */}
        <Link href="/subscribe/login">
          <Button className="hidden md:inline-block">
            Sign In
          </Button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`block py-2 text-gray-800 hover:text-blue-600 transition ${
                    pathname === href ? "text-blue-700 font-semibold" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link href="/subscribe/login" onClick={closeMobileMenu}>
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
