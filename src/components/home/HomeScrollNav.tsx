"use client";

import { useEffect, useState } from "react";

const sections = [
  { label: "Hero", id: "hero" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Features", id: "key-features" },
  { label: "Why OptimaliQ", id: "why-optimaliq" },
  { label: "FAQ", id: "faq" },
];

export default function HomeScrollNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      let current = "hero";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section.id;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-[64px] z-40 w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <ul className="flex overflow-x-auto no-scrollbar space-x-2 sm:space-x-6 py-2 text-sm sm:text-base font-medium text-gray-700">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  active === section.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                    : "hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 