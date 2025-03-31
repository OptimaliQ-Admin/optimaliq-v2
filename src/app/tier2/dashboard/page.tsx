"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import ScoreCard from "@/components/dashboard/ScoreCard";
import InsightCard from "@/components/dashboard/InsightCard";
import GrowthChart from "@/components/dashboard/GrowthChart";
import SectionHeader from "@/components/dashboard/SectionHeader";

function Tier2DashboardComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const insightsResponse = await axios.post("/api/tier2/dashboard", { email });
        const trendsResponse = await axios.post("/api/tier2/getTrends", {
          industry: "Consulting",
        });

        if (insightsResponse.data.error) {
          setError(insightsResponse.data.error);
        } else {
          const { promptRetake, ...rest } = insightsResponse.data;
setInsights({
  ...rest,
  promptRetake,
  topTrends: trendsResponse.data?.topTrends || [],
});
        }
      } catch (err) {
        setError("Failed to retrieve insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [email]);

  const mapList = (arr: any[], labelKey: string, detailKey: string) =>
    arr?.map((item) => ({ label: item[labelKey], detail: item[detailKey] })) || [];

  if (!email) {
    return <p className="text-red-500">⚠️ Error: Email is required.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GMF+</h2>
          <nav className="space-y-4">
            <a
              href={`/tier2/dashboard?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              📊 Dashboard
            </a>
            <a
              href={`/tier2/insights?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              📑 Insights
            </a>
            <a
              href={`/tier2/assessment?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              📝 Assessment
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">
              👥 Community
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <p className="text-gray-700 font-medium">{email || "User"}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col p-8 space-y-6">
        {loading ? (
          <p className="text-gray-600 text-lg text-center">Loading insights...</p>
        ) : error ? (
          <p className="text-red-500 text-lg text-center">{error}</p>
        ) : (
          <>
            <SectionHeader title="🏆 Business Score Overview" />
            {insights?.promptRetake && (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-4 shadow-sm">
    <p className="font-semibold">🕒 It's time to retake your assessment.</p>
    <p className="text-sm">
      Your last assessment was over 30 days ago. To ensure accurate insights, please{" "}
      <a
        href={`/tier2/assessment?email=${encodeURIComponent(email || "")}`}
        className="underline font-semibold text-yellow-700 hover:text-yellow-900"
      >
        retake your assessment
      </a>
      .
    </p>
  </div>
)}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard
                title="Overall Score"
                score={insights?.score}
                benchmark={insights?.industryAvgScore}
              />
              <ScoreCard title="Strategy" score={insights?.strategyScore} />
              <ScoreCard title="Process" score={insights?.processScore} />
              <ScoreCard title="Technology" score={insights?.technologyScore} />
            </div>

            {insights?.chartData && <GrowthChart data={insights.chartData} />}

            <InsightCard
              title="🚀 30-Day Growth Plan"
              items={mapList(insights?.roadmap || [], "task", "expectedImpact")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsightCard
                title="✅ Strengths"
                items={mapList(insights?.strengths || [], "title", "impact")}
              />
              <InsightCard
                title="🚨 Weaknesses"
                items={mapList(insights?.weaknesses || [], "title", "impact")}
              />
            </div>

            <InsightCard
              title="📊 Trends & Insights"
              items={mapList(insights?.topTrends || [], "trend", "whyItMatters")}
            />

            {/* Placeholder Sections - Retained as-is */}
            <div className="flex-1 flex flex-col p-8 space-y-6">
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">
                  📊 Market Trend Prediction (Placeholder)
                </h2>
                <p className="text-gray-600 mt-2">
                  (Includes real market data, stock trends, and sector performance)
                  <br />
                  ✅ Example:
                  <br />
                  📈 “Retail eCommerce growth has slowed to 3% YoY…”
                </p>
              </div>

              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">
                  🔥 Business Trend Predictions (Placeholder)
                </h2>
                <p className="text-gray-600 mt-2">
                  ✅ Example:
                  <br />
                  📢 “Remote work is stabilizing at 40% adoption…”
                </p>
              </div>

              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">
                  ⚠️ Top Challenges & Opportunities in Industry (Placeholder)
                </h2>
                <p className="text-gray-600 mt-2">
                  ✅ Example:
                  <br />
                  ⚠️ “Customer acquisition costs have risen by 30%…”
                </p>
              </div>

              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">
                  📢 Marketing Investment Trends (Placeholder)
                </h2>
                <p className="text-gray-600 mt-2">
                  ✅ Example:
                  <br />
                  📊 “SEO & content marketing are delivering the highest ROI…”
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Tier2Dashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Tier2DashboardComponent />
    </Suspense>
  );
}
