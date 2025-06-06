"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import InsightsDisplay from "../../../components/assessment/InsightsDisplay";
import RoadmapDisplay from "../../../components/assessment/RoadmapDisplay";

// Helper function to clamp scores between 0 and 5
const clamp = (val: number) => Math.min(5, Math.max(0, parseFloat(String(val))));

export default function Step3Page() {
  const router = useRouter();
  const [insights, setInsights] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
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

        // Set insights with fallback values and clamped scores
        setInsights({
          strategy: {
            score: clamp(data.strategy_score),
            insight: data.strategy_insight || "Strategy insight unavailable."
          },
          process: {
            score: clamp(data.process_score),
            insight: data.process_insight || "Process insight unavailable."
          },
          technology: {
            score: clamp(data.technology_score),
            insight: data.technology_insight || "Technology insight unavailable."
          },
          overall: clamp(data.overall_score)
        });

        // Set roadmap with fallback values
        setRoadmap({
          strategy: data.strategy_roadmap || "Strategy roadmap unavailable.",
          process: data.process_roadmap || "Process roadmap unavailable.",
          technology: data.technology_roadmap || "Technology roadmap unavailable."
        });

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

  if (!insights || !roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Loading your insights...</h1>
        <div className="mt-8 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="animate-pulse bg-blue-600 h-full w-2/3 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Your Growth Assessment Results</h1>
        <InsightsDisplay insights={insights} />
        <RoadmapDisplay roadmap={roadmap} />
      </div>
    </div>
  );
}
