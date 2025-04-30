"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabase";
import ScoreCardGrid from "../../../components/growthAssessment/step3/ScoreCardGrid";
import ScoreLineChart from "../../../components/growthAssessment/step3/ScoreLineChart";
import ScoreInsightGrid from "../../../components/growthAssessment/step3/ScoreInsightGrid";

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

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;
    if (!u_id) {
      alert("❌ User session expired. Please start again.");
      router.push("/growth-assessment");
      return;
    }

    fetchInsights(u_id);
  }, [router]);

  const fetchInsights = async (u_id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("insights")
        .select("strategy_score, strategy_insight, processscore, process_insight, technology_score, technology_insight, overall_score")
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6">
      <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Your Strategic Insights & Growth Projection</h1>
        <p className="text-gray-600 text-center mt-2">
          A data-driven assessment that uncovers your business’s potential in the market and provides key insights for <span className="font-bold text-blue-600">optimization.</span>
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
    <Suspense fallback={<p className="text-center mt-12 text-gray-500">Loading insights...</p>}>
      <Step3Component />
    </Suspense>
  );
}
