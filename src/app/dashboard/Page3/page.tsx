"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Page3() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Prevent duplicate API calls
  const hasFetched = useRef(false);

  // Retrieve responses from Page2
  const [businessResponses, setBusinessResponses] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [score, setScore] = useState(0);
  const [insights, setInsights] = useState({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  });
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState([]);

  useEffect(() => {
    if (hasFetched.current) return; // ✅ Prevent duplicate calls
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
  }, [searchParams]); // ✅ Only runs once, preventing multiple API calls

  const fetchAIInsights = async (businessData, userData) => {
    if (!businessData || !userData) {
      console.error("❌ Missing data: businessData or userData is undefined.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/getInsights", {
        answers: { ...businessData, ...userData } // ✅ Send in the correct format
      });

      // ✅ Round the score down to the nearest 0.5
      const roundToNearestHalf = (num) => Math.floor(num * 2) / 2;
      const roundedScore = roundToNearestHalf(response.data.score ?? 0);

      setScore(roundedScore);
      setInsights({
        strategy: response.data.strategyInsight || "No insight available.",
        process: response.data.processInsight || "No insight available.",
        technology: response.data.technologyInsight || "No insight available.",
      });

      setRoadmapData([
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ]);
    } catch (error) {
      console.error("🚨 Error fetching AI insights:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4">
      <header className="w-full max-w-4xl py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your AI-Generated Business Insights</h1>
        <p className="text-gray-600 mt-2">Here’s how you can scale your business efficiently.</p>
      </header>

      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white text-center rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Your GMF+ Score</h2>
          <p className="text-5xl font-bold text-blue-600 mt-2">{score} / 5</p>
        </Card>
      </section>

      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🛣️ Roadmap to Score Improvement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roadmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="w-full max-w-3xl mt-6">
        <Card className="p-6 shadow-lg bg-white rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">🤖 AI-Generated Insights</h2>
          {loading ? (
            <p className="text-gray-500">Generating insights...</p>
          ) : (
            <>
              <p className="text-gray-700 mt-2"><strong>📌 Strategy:</strong> {insights.strategy}</p>
              <p className="text-gray-700 mt-2"><strong>⚙️ Process:</strong> {insights.process}</p>
              <p className="text-gray-700 mt-2"><strong>🖥️ Technology:</strong> {insights.technology}</p>
            </>
          )}
        </Card>
      </section>
    </div>
  );
}
