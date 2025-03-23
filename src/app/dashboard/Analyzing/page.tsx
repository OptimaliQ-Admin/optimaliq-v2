"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

function AnalyzingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate statements every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto redirect to Page 3 after delay
  useEffect(() => {
    const userInfo = searchParams.get("userInfo");
    if (userInfo) {
      setTimeout(() => {
        router.push(`/dashboard/Page3?userInfo=${userInfo}`);
      }, 4500); // simulate loading delay
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Analyzing your business...</h1>
      <p className="text-xl text-gray-700 italic max-w-xl transition-opacity duration-300 ease-in-out">
        {statements[currentIndex]}
      </p>
      <div className="mt-8 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="animate-pulse bg-blue-600 h-full w-2/3 rounded-full" />
      </div>
      <p className="mt-4 text-sm text-gray-500">Powered by OptimaliQ.ai</p>
    </div>
  );
}

// ✅ Wrap in Suspense for useSearchParams
export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-12 text-gray-500">Preparing your insights...</div>}>
      <AnalyzingComponent />
    </Suspense>
  );
}
