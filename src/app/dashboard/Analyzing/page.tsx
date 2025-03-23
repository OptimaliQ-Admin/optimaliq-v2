"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔁 Rotate statements every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 Call API to generate insights, then redirect
  useEffect(() => {
    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;

    if (!u_id) {
      router.push("/dashboard/Page1");
      return;
    }

    const generateInsights = async () => {
      try {
        const response = await fetch("/api/getInsights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id }),
        });

        if (response.ok) {
          router.push("/dashboard/Page3");
        } else {
          router.push("/dashboard/Page1");
        }
      } catch {
        router.push("/dashboard/Page1");
      }
    };

    generateInsights();
  }, [router]);

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

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-12 text-gray-500">Preparing your insights...</div>}>
      <AnalyzingComponent />
    </Suspense>
  );
}
