//src/app/tier2/dashboard/page.tsx
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
import SectionHeader from "@/components/dashboard/SectionHeader";
import InsightLoading from "@/components/dashboard/InsightLoading";
import ScoreContextModal from "@/components/dashboard/ScoreContextModal";
import ExecutiveRadarChart from "@/components/dashboard/ExecutiveRadarChart";
import BusinessTrendCard from "@/components/dashboard/BusinessTrendCard";
import GrowthChart from "@/components/dashboard/GrowthChart";
import MarketingPlaybookCard from "@/components/dashboard/MarketingPlaybookCard";
import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/sidebar";



function Tier2DashboardComponent() {
  const searchParams = useSearchParams();
const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [welcomeData, setWelcomeData] = useState({ firstName: '', quote: '', author: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const MarketInsightCard = dynamic(() => import("@/components/dashboard/MarketInsightCard"), { ssr: false });
  

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const insightsResponse = await axios.post("/api/tier2/dashboard", { email });
        // Trends are currently optional — comment out unless used
        // const trendsResponse = await axios.post("/api/tier2/getTrends", {
        //   industry: insightsResponse.data?.industry || "Consulting",
        // });

        if (insightsResponse.data.error) {
          setError(insightsResponse.data.error);
        } else {
          const { promptRetake, ...rest } = insightsResponse.data;
          setInsights({
            ...rest,
            promptRetake,
            // topTrends: trendsResponse.data?.topTrends || [],
          });
        }
      } catch (err) {
        setError("Failed to retrieve insights.");
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchInsights();
  }, [email]);
  useEffect(() => {
    axios.post("/api/tier2/dashboard/welcome_message", { email })
      .then(res => setWelcomeData(res.data))
      .catch(() => setWelcomeData({
        firstName: '',
        quote: "Welcome back! Let's grow your business today.",
        author: "GMF+"
      }));
  }, [email]);   

  const mapList = (arr: any[], labelKey: string, detailKey: string) =>
    arr?.map((item) => ({ label: item[labelKey], detail: item[detailKey] })) || [];

  if (!email) {
    return <p className="text-center text-red-600">⚠️ Email is required to access the dashboard.</p>;
  }  
  const handleScoreClick = async (category: string, score: number) => {
    console.log("🔍 Learn More clicked:", { category, score });
  
    const scoreBands = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5];
    const band = scoreBands.find((s) => score <= s + 0.5) ?? 4.5;
  
    const payload = {
      category,
      industry: insights?.industry?.trim().toLowerCase() ?? "other",
      score,
    };    
  
    console.log("📦 Payload being sent to API:", payload);
  
    try {
      const res = await axios.post("/api/tier2/dashboard/scorecard_insights", payload);
      console.log("✅ Response from API:", res.data);
  
      if (res.data) {
        setSelectedCardData(res.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("❌ Failed to fetch scorecard context:", err);
    }
  };  
  
  return (
      <div className="flex-1 flex flex-col p-8 space-y-6">
      {loading ? (
  <InsightLoading />
) : error ? (
          <p className="text-red-500 text-lg text-center">{error}</p>
        ) : (
          <>
            <SectionHeader title="🏆 Business Score Overview" />
            {insights?.promptRetake && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-4 shadow-sm">
                <p className="font-semibold">🕒 It's time to retake your assessment.</p>
                <p className="text-sm">
                  Your last assessment was over 30 days ago. To ensure accurate insights, please {" "}
                  <a
                    href="/tier2/assessment"
                    className="underline font-semibold text-yellow-700 hover:text-yellow-900"
                  >
                    retake your assessment
                  </a>
                  .
                </p>
              </div>
            )}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<ScoreCard
  title="Overall Score"
  score={insights?.score}
  industryAvg={insights?.industryAvgScore}
  topPerformer={insights?.topPerformerScore}
  description="Your overall business score reflects maturity across strategy, process, and technology."
  onLearnMore={() => handleScoreClick("overall", insights?.score)}
/>

  <ScoreCard
    title="Strategy"
    score={insights?.strategyScore}
    description="Assesses your clarity, positioning, and future vision across the business."
    onLearnMore={() => handleScoreClick("strategy", insights?.strategyScore)}
  />

  <ScoreCard
    title="Process"
    score={insights?.processScore}
    description="Evaluates your scalability, execution consistency, and operational discipline."
    onLearnMore={() => handleScoreClick("process", insights?.processScore)}
  />

  <ScoreCard
    title="Technology"
    score={insights?.technologyScore}
    description="Looks at how effectively your tech stack enables growth, automation, and CX."
    onLearnMore={() => handleScoreClick("technology", insights?.technologyScore)}
  />
</div>

<ScoreContextModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  data={selectedCardData}
/>


{insights && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    <ExecutiveRadarChart
      strategy={insights.strategyScore}
      process={insights.processScore}
      technology={insights.technologyScore}
      industryAvg={insights.industryAvgScore}
      topPerformer={insights.topPerformerScore}
    />
    <div className="h-full">
  <div className="transition-transform duration-300 ease-in-out hover:scale-[1.01]">
    <InsightCard
      title="🚀 30-Day Growth Plan"
      items={mapList(insights?.roadmap || [], "task", "expectedImpact")}
    />
  </div>
  {insights?.chartData && (
    <div className="mt-2">
      <GrowthChart data={insights.chartData} />
    </div>
  )}
</div>

  </div>
)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsightCard title="✅ Strengths" items={mapList(insights?.strengths || [], "title", "impact")} />
              <InsightCard title="🚨 Weaknesses" items={mapList(insights?.weaknesses || [], "title", "impact")} />
            </div>

            {/* Optional Trends Card - Uncomment when API is active */}
            {/* <InsightCard
              title="📊 Trends & Insights"
              items={mapList(insights?.topTrends || [], "trend", "whyItMatters")}
            /> */}

           {/* Insight Sections */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <MarketInsightCard industry={(insights?.industry || "other").trim().toLowerCase()} />
  <BusinessTrendCard />

  <div className="p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
    <h2 className="text-lg font-bold text-gray-700">⚠️ Top Challenges & Opportunities in Industry (Placeholder)</h2>
    <p className="text-gray-600 mt-2">
      ✅ Example:
      <br />⚠️ “Customer acquisition costs have risen by 30%…”
    </p>
  </div>

  {/* 🔥 FIXED: No extra wrapper */}
  <MarketingPlaybookCard />
</div>
          </>
        )}
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