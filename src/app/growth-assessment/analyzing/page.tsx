// src/app/growth-assessment/analyzing/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AnalyzingMessage from "../../../components/shared/AnalyzingMessage";


function AnalyzingComponent() {
  const router = useRouter();

  useEffect(() => {
    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;
    if (!u_id) {
      router.push("/growth-assessment");
      return;
    }

    const generateInsights = async () => {
      try {
        const res = await fetch("/api/growthAssessment/getInsights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: u_id }),
        });

        if (res.ok) {
          router.push("/growth-assessment/step3");
        } else {
          router.push("/growth-assessment");
        }
      } catch {
        router.push("/growth-assessment");
      }
    };

    generateInsights();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Analyzing your business...</h1>
      <AnalyzingMessage />
      <div className="mt-8 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="animate-pulse bg-blue-600 h-full w-2/3 rounded-full" />
      </div>
      <p className="mt-4 text-sm text-gray-500">Powered by OptimaliQ.ai</p>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="text-center mt-12 text-gray-500">Preparing your insights...</div>}>
      <AnalyzingComponent />
    </Suspense>
  );
}
