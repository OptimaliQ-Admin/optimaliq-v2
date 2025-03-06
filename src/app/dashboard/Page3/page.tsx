"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function Page3Component() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasFetched = useRef(false);
  const [businessResponses, setBusinessResponses] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
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

    const businessData = searchParams.get("businessResponses");
    const userData = searchParams.get("userInfo");

    if (businessData && userData) {
      try {
        const parsedBusinessData = JSON.parse(decodeURIComponent(businessData));
        const parsedUserData = JSON.parse(decodeURIComponent(userData));

        setBusinessResponses(parsedBusinessData);
        setUserInfo(parsedUserData);

        fetchAIInsights(parsedBusinessData, parsedUserData);
      } catch (error) {
        console.error("Error parsing query parameters:", error);
        router.push("/dashboard/Page2");
      }
    } else {
      router.push("/dashboard/Page2");
    }
  }, [searchParams]);

  const fetchAIInsights = async (businessData: any, userData: any) => {
    if (!businessData || !userData) {
      console.error("❌ Missing data: businessData or userData is undefined.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/getInsights", {
        answers: { ...businessData, ...userData },
      });

      const parsedData = response.data;
      const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;
      const roundedScore = roundToNearestHalf(parsedData.score ?? 0);

      setScore(roundedScore);
      setInsights({
        strategy: parsedData.strategyInsight || "No insight available.",
        process: parsedData.processInsight || "No insight available.",
        technology: parsedData.technologyInsight || "No insight available.",
      });

      setRoadmapData([
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ]);
    } catch (error: any) {
      console.error("🚨 Error fetching AI insights:", error?.response?.data || error?.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6">
      {/* Executive Summary Panel */}
      <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Your Business Insights Report</h1>
        <p className="text-gray-600 text-center mt-2">
          A data-backed assessment of your business's current state and a roadmap to accelerate growth.
        </p>
      </section>

      {/* Score & Chart Section */}
<section className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Score & Benchmarks (Left) */}
  <div className="space-y-6">
    <Card className="p-6 shadow-md bg-white text-center rounded-lg w-[calc(100%-100px)]">
      <h2 className="text-lg font-semibold text-gray-700">📊 GMF+ Score</h2>
      <p className="text-6xl font-bold text-blue-600 mt-2">{score} / 5</p>
      <p className="text-gray-500 text-sm mt-2">Your current growth maturity level.</p>
    </Card>
    <Card className="p-6 shadow-md bg-white text-center rounded-lg w-[calc(100%-100px)]">
      <h2 className="text-lg font-semibold text-gray-700">📈 Industry Benchmark</h2>
      <p className="text-5xl font-bold text-green-600 mt-2">4.2 / 5</p>
      <p className="text-gray-500 text-sm mt-2">Average score of top industry performers.</p>
    </Card>
    <Card className="p-6 shadow-md bg-white text-center rounded-lg w-[calc(100%-100px)]">
      <h2 className="text-lg font-semibold text-gray-700">🔍 Optimization Potential</h2>
      <p className="text-5xl font-bold text-orange-500 mt-2">+{(5 - score).toFixed(1)}</p>
      <p className="text-gray-500 text-sm mt-2">How much you can improve your score.</p>
    </Card>
  </div>

  {/* Growth Roadmap Chart */}
  <Card className="p-6 shadow-md bg-white rounded-lg w-[calc(100%+80px)] ml-[-80px]">
    <h2 className="text-lg font-bold text-gray-700 text-center">🚀 Your Growth Roadmap</h2>
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
  </Card>
</section>



      {/* AI-Generated Insights with Hover Effect */}
      <section className="w-full max-w-5xl mt-8">
        <Card className="p-6 shadow-md bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 text-center">📌 AI-Generated Business Insights</h2>
          {loading ? (
            <p className="text-gray-500 text-center mt-4">Generating insights...</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {["strategy", "process", "technology"].map((key) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{key.charAt(0).toUpperCase() + key.slice(1)} Insight</h3>
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
