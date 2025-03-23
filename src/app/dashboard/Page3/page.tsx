"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function Page3Component() {
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
      router.push("/dashboard/Page1");
      return;
    }

    fetchInsights(u_id);
  }, [router]);

  const fetchInsights = async (u_id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
  .from("insights")
  .select("strategyscore, strategyinsight, processscore, processinsight, technologyscore, technologyinsight, overallscore")
  .eq("u_id", userData.u_id)
  .order("generatedat", { ascending: false }) // get latest
  .limit(1)
  .maybeSingle();


      if (error || !data) {
        setInsights({
          strategy: "No insight available.",
          process: "No insight available.",
          technology: "No insight available.",
        });
        return;
      }

      const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;
      const roundedScore = roundToNearestHalf(data.overallscore ?? 0);

      setScore(roundedScore);
      setInsights({
        strategy: data.strategyinsight || "No insight available.",
        process: data.processinsight || "No insight available.",
        technology: data.technologyinsight || "No insight available.",
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
        <div className="space-y-6">
          <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">📊 GMF+ Score</h2>
            <p className="text-6xl font-bold text-red-600 mt-2">{score} / 5</p>
            <p className="text-gray-500 text-sm mt-2">Your current growth maturity level.</p>
            <p className="text-xs text-gray-400 mt-1 italic">Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span></p>
          </Card>

          <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              📈 Industry Benchmark <span title="Unlock full benchmarking with OptimaliQ Pro" className="ml-1 cursor-help">🔒</span>
            </h2>
            <p className="text-5xl font-bold text-green-600 mt-2">4.2 / 5</p>
            <p className="text-gray-500 text-sm mt-2">Average score of top industry performers.</p>
          </Card>

          <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              🔍 Optimization Potential <span title="Unlock predictive modeling with OptimaliQ Pro" className="ml-1 cursor-help">🔒</span>
            </h2>
            <p className="text-5xl font-bold text-blue-600 mt-2">+{(5 - score - 0.5).toFixed(1)} / +20%</p>
            <p className="text-gray-500 text-sm mt-2">Potential to elevate your score and revenue over the next 12 months.</p>
          </Card>
        </div>

        <Card className="p-6 shadow-md bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 text-center">🚀 Your Growth Projections</h2>
          <p className="text-gray-600 text-center text-sm mb-4">
            A visual projection of how strategic improvements can elevate your business performance over time.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={roadmapData} margin={{ top: 20, right: 10, left: -30, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "#4F46E5" }} />
              <YAxis domain={[1, 5]} tick={{ fill: "#4F46E5" }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#gradient)"
                strokeWidth={4}
                dot={{ r: 6, stroke: "#2563EB", strokeWidth: 2, fill: "white" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center">
            <p className="text-gray-700 text-sm mt-2">
              Most businesses fail because they rely on instinct over intelligence.
              <br /><span className="font-bold text-blue-600">OptimaliQ</span> provides the exact roadmap to dominate your industry.
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-600 transition">
              Learn More
            </button>
          </div>
        </Card>
      </section>

      <section className="w-full max-w-5xl mt-8">
        <Card className="p-6 shadow-md bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-gray-700 text-center">📌 Data Driven Business Insights</h2>
          {loading ? (
            <p className="text-gray-500 text-center mt-4">Generating insights...</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {["strategy", "process", "technology"].map((key) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold text-blue-600">{key.charAt(0).toUpperCase() + key.slice(1)} Insight</h3>
                  <p className="text-gray-600 mt-2">{insights[key]}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

export default function Page3() {
  return (
    <Suspense fallback={<p>Loading insights...</p>}>
      <Page3Component />
    </Suspense>
  );
}
