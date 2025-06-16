"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import ScoreCardGrid from "../../../components/growthAssessment/step3/ScoreCardGrid";
import ScoreLineChart from "../../../components/growthAssessment/step3/ScoreLineChart";
import ScoreInsightGrid from "../../../components/growthAssessment/step3/ScoreInsightGrid";

// Helper function to clamp scores between 0 and 5
const clamp = (val: number) => Math.min(5, Math.max(0, parseFloat(String(val))));

function Step3Component() {
  const router = useRouter();
  const [score, setScore] = useState<number>(0);
  const [insights, setInsights] = useState<{ [key: string]: string }>({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [roadmapData, setRoadmapData] = useState<{ month: string; score: number }[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 6;
  const RETRY_INTERVAL = 5000;

  useEffect(() => {
    const fetchInsights = async () => {
      const u_id = localStorage.getItem("u_id");
      if (!u_id) {
        console.error("❌ User ID not found in localStorage");
        showToast.error("User ID not found. Please start over.");
        localStorage.removeItem("u_id");
        router.push("/growth-assessment");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("growth_insights")
          .select("*")
          .eq("u_id", u_id)
          .order("generatedat", { ascending: false })
          .maybeSingle();

        if (error) {
          console.error("❌ Error fetching insights:", error);
          throw error;
        }

        if (!data) {
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`);
            setRetryCount(prev => prev + 1);
            setTimeout(fetchInsights, RETRY_INTERVAL);
            return;
          }
          console.error("❌ No insights found after all retries");
          showToast.error("Failed to load insights. Please try again.");
          router.push("/growth-assessment/step2");
          return;
        }

        // Validate insight structure
        const requiredFields = [
          "strategy_score", "strategy_insight",
          "process_score", "process_insight",
          "technology_score", "technology_insight",
          "overall_score"
        ];

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
          console.error("❌ Missing insight fields:", missingFields);
        }

        const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;
        const roundedScore = roundToNearestHalf(clamp(data.overall_score ?? 0));

        setScore(roundedScore);
        setInsights({
          strategy: data.strategy_insight || "Strategy insight unavailable.",
          process: data.process_insight || "Process insight unavailable.",
          technology: data.technology_insight || "Technology insight unavailable.",
        });

        setRoadmapData([
          { month: "Now", score: roundedScore },
          { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
          { month: "6 Months", score: Math.min(5, roundedScore + 1) },
          { month: "12 Months", score: Math.min(5, roundedScore + 2) },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("❌ Error in fetchInsights:", error);
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchInsights, RETRY_INTERVAL);
        } else {
          showToast.error("Failed to load insights. Please try again.");
          router.push("/growth-assessment/step2");
        }
      }
    };

    fetchInsights();
  }, [router, retryCount]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6">
      <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Your Strategic Insights & Growth Projection</h1>
        <p className="text-gray-600 text-center mt-2">
          A data-driven assessment that uncovers your business&rsquo;s potential in the market and provides key insights for <span className="font-bold text-blue-600">optimization.</span>
        </p>
      </section>

      <section className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCardGrid score={score} />
        <ScoreLineChart data={roadmapData} score={score} />
      </section>

      <section className="w-full max-w-5xl mt-8">
        <ScoreInsightGrid loading={loading} insights={insights} />
      </section>
    </div>
  );
}

export default function Step3Page() {
  return (
    <Suspense fallback={<div className="text-center mt-12 text-gray-500">Loading insights...</div>}>
      <Step3Component />
    </Suspense>
  );
}
