// File: src/app/premium/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import axios from "axios";
import InsightLoading from "@/components/dashboard/InsightLoading";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ScoreCard from "@/components/dashboard/ScoreCard";
import ExecutiveRadarChart from "@/components/dashboard/ExecutiveRadarChart";
import InsightCard from "@/components/dashboard/InsightCard";
import GrowthChart from "@/components/dashboard/GrowthChart";
import ScoreContextModal from "@/components/dashboard/ScoreContextModal";
import BusinessTrendCard from "@/components/dashboard/BusinessTrendCard";
import MarketingPlaybookCard from "@/components/dashboard/MarketingPlaybookCard";
import dynamic from "next/dynamic";
import { DashboardInsights } from "@/lib/types/DashboardInsights";

const MarketInsightCard = dynamic(() => import("@/components/dashboard/MarketInsightCard"), { ssr: false });

export default function PremiumDashboardPage() {
  const { user } = usePremiumUser();
  const u_id = user?.u_id;

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [welcomeData, setWelcomeData] = useState({ firstName: '', quote: '', author: '' });
  const [modalData, setModalData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!u_id) return;

    const fetchData = async () => {
      try {
        const res = await axios.post("/api/dashboard", { u_id });
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setInsights(res.data);
        }
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Unable to fetch dashboard insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [u_id]);

  useEffect(() => {
    if (!u_id) return;
    axios.post("/api/dashboard/welcome_message", { u_id })
      .then(res => setWelcomeData(res.data))
      .catch(() => setWelcomeData({
        firstName: '',
        quote: "Welcome back! Let’s grow your business today.",
        author: "OptimaliQ"
      }));
  }, [u_id]);

  const handleScoreClick = async (category: string, score: number) => {
    try {
      const res = await axios.post("/api/dashboard/scorecard_insights", {
        category,
        score,
        industry: insights?.industry || "other",
      });
      setModalData(res.data);
    } catch (err) {
      console.error("Failed to fetch modal insights:", err);
    }
  };

  if (!u_id || loading) return <InsightLoading />;
  if (error) return <p className="text-center text-red-600 p-10">{error}</p>;
  if (!insights) return null;

  return (
    <div className="p-8 space-y-6">
      <SectionHeader title="🏆 Business Score Overview" />

      {insights.promptRetake && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-4">
          <p className="font-semibold">🕒 Time to retake your assessment.</p>
          <p className="text-sm">
            Your last assessment was over 30 days ago. Please {" "}
            <a href="/premium/onboarding/initial-assessment" className="underline font-semibold text-yellow-700 hover:text-yellow-900">
              retake your assessment
            </a>
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard
          title="Overall Score"
          score={insights.score}
          industryAvg={insights.industryAvgScore}
          topPerformer={insights.topPerformerScore}
          description="Maturity across strategy, process, and technology."
          onLearnMore={() => handleScoreClick("overall", insights.score)}
        />
        <ScoreCard
          title="Strategy"
          score={insights.strategyScore}
          description="Clarity, positioning, and strategic alignment."
          onLearnMore={() => handleScoreClick("strategy", insights.strategyScore)}
        />
        <ScoreCard
          title="Process"
          score={insights.processScore}
          description="Consistency, execution, and scalability."
          onLearnMore={() => handleScoreClick("process", insights.processScore)}
        />
        <ScoreCard
          title="Technology"
          score={insights.technologyScore}
          description="Growth, automation, and efficiency."
          onLearnMore={() => handleScoreClick("technology", insights.technologyScore)}
        />
      </div>

      <ScoreContextModal open={!!modalData} onClose={() => setModalData(null)} data={modalData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExecutiveRadarChart
          strategy={insights.strategyScore}
          process={insights.processScore}
          technology={insights.technologyScore}
          industryAvg={insights.industryAvgScore}
          topPerformer={insights.topPerformerScore}
        />
        <div className="space-y-4">
          <InsightCard title="🚀 30-Day Growth Plan" items={insights.roadmap.map(item => ({ label: item.task, detail: item.expectedImpact }))} />
          <GrowthChart data={insights.chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="✅ Strengths" items={insights.strengths.map(item => ({ label: item.title, detail: item.impact }))} />
        <InsightCard title="🚨 Weaknesses" items={insights.weaknesses.map(item => ({ label: item.title, detail: item.impact }))} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketInsightCard industry={(insights.industry || "other").trim().toLowerCase()} />
        <BusinessTrendCard />
        <MarketingPlaybookCard />
      </div>
    </div>
  );
}