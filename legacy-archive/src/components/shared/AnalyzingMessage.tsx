// src/components/shared/AnalyzingMessage.tsx
"use client";

import { useEffect, useState } from "react";

const statements = [
  "Bringing 20 years of battlefield strategy to your business.",
  "One insight can change everything.",
  "Smart businesses don’t guess—they measure.",
  "Turning complexity into clarity, one model at a time.",
  "If you can’t scale it, you can’t sell it.",
  "We don’t just diagnose. We prescribe transformation.",
  "Clarity isn’t a luxury—it’s your growth engine.",
  "You can’t fix what you don’t understand.",
  "OptimaliQ reveals what your gut instinct misses.",
  "Benchmark your way to category leadership.",
];

export default function AnalyzingMessage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xl text-gray-700 italic max-w-xl transition-opacity duration-300 ease-in-out">
      {statements[index]}
    </p>
  );
}
