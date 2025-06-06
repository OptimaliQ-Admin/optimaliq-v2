// src/app/growth-assessment/analyzing/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AnalyzingMessage from "../../../components/shared/AnalyzingMessage";
import { showToast } from "@/lib/utils/toast";


function AnalyzingComponent() {
  const router = useRouter();

  useEffect(() => {
    const fetchInsights = async () => {
      const u_id = localStorage.getItem("u_id");
      if (!u_id) {
        showToast.error("User ID not found. Please start over.");
        localStorage.removeItem("u_id");
        router.push("/growth-assessment");
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch("/api/growthAssessment/getInsights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: u_id }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ API Error:", data.error);
          console.error("API response:", data);
          showToast.error("Failed to generate insights. Please try again.");
          router.push("/growth-assessment/step2");
          return;
        }

        if (data.success) {
          console.log("✅ Insights generated successfully");
          router.push("/growth-assessment/step3");
        } else {
          console.error("❌ Unexpected API response:", data);
          showToast.error("Something went wrong. Please try again.");
          router.push("/growth-assessment/step2");
        }
      } catch (error) {
        console.error("❌ Error fetching insights:", error);
        showToast.error("Failed to generate insights. Please try again.");
        router.push("/growth-assessment/step2");
      }
    };

    fetchInsights();
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
