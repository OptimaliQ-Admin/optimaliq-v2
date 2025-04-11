//src/components/dashboard/InsightLoading.tsx
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

export default function InsightLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statements.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Analyzing your data...</h1>
      <p className="text-xl text-gray-700 italic max-w-xl transition-opacity duration-500 ease-in-out">
        {statements[index]}
      </p>
      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="animate-pulse bg-blue-600 h-full w-2/3 rounded-full" />
      </div>
      <p className="text-sm text-gray-400">Powered by OptimaliQ.ai</p>
    </div>
  );
}
