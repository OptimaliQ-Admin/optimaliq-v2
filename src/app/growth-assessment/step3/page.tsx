"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabase";
import ScoreCardGrid from "../../../components/growthAssessment/step3/ScoreCardGrid";
import ScoreLineChart from "../../../components/growthAssessment/step3/ScoreLineChart";
import ScoreInsightGrid from "../../../components/growthAssessment/step3/ScoreInsightGrid";
import { showToast } from "@/lib/utils/toast";
import SectionHeader from "@/components/dashboard/SectionHeader";
import SubscriptionPopup from "@/components/modals/SubscriptionPopup";

function Step3Component() {
  const router = useRouter();
  const hasFetched = useRef(false);

  const [score, setScore] = useState<number>(0);
  const [insights, setInsights] = useState<{ [key: string]: string }>({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [roadmapData, setRoadmapData] = useState<{ month: string; score: number }[]>([]);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;
    if (!u_id) {
      showToast.error("User session expired. Please start again.");
      router.push("/growth-assessment");
      return;
    }

    fetchInsights(u_id);
  }, [router]);

  // Timer for subscription popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionPopup(true);
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  const fetchInsights = async (u_id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("growth_insights")
        .select("strategy_score, strategy_insight, process_score, process_insight, technology_score, technology_insight, overall_score")
        .eq("u_id", u_id)
        .order("generatedat", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return;
      }

      const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;
      const roundedScore = roundToNearestHalf(data.overall_score ?? 0);

      setScore(roundedScore);
      setInsights({
        strategy: data.strategy_insight || insights.strategy,
        process: data.process_insight || insights.process,
        technology: data.technology_insight || insights.technology,
      });

      setRoadmapData([
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ]);
    } finally {
      setLoading(false);
      localStorage.removeItem("u_id");
    }
  };

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1920px] mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Growth Analysis is Ready
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join other businesses that use OptimaliQ to get ongoing insights, 
                real-time benchmarks, and AI-powered growth strategies.
              </p>
            </div>
          </div>

          {/* Score Overview Section */}
          <div className="space-y-6">
            <SectionHeader title="🏆 Business Score Overview" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCardGrid score={score} />
            </div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreLineChart data={roadmapData} score={score} />
            <div className="space-y-6">
              <ScoreInsightGrid loading={loading} insights={insights} />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Popup */}
      <SubscriptionPopup
        isOpen={showSubscriptionPopup}
        onClose={handleCloseSubscriptionPopup}
      />
    </>
  );
}

export default function Step3Page() {
  return (
    <Suspense fallback={<p className="text-center mt-12 text-gray-500">Loading insights...</p>}>
      <Step3Component />
    </Suspense>
  );
}
