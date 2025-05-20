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
        quote: "Welcome back! Let's grow your business today.",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1920px] mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {welcomeData.firstName || 'there'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 italic">
            "{welcomeData.quote}" - {welcomeData.author}
          </p>
        </div>

        {/* Assessment Reminder */}
        {insights.promptRetake && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
            <p className="font-semibold">🕒 Time to retake your assessment</p>
            <p className="text-sm mt-1">
              Your last assessment was over 30 days ago. Please {" "}
              <a href="/premium/onboarding/initial-assessment" className="underline font-semibold text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100">
                retake your assessment
              </a>
              {" "}to keep your insights current.
            </p>
          </div>
        )}

        {/* Score Overview Section */}
        <div className="space-y-6">
          <SectionHeader title="🏆 Business Score Overview" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScoreCard
              title="Overall Score"
              score={insights.overall_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Maturity across strategy, process, and technology."
              onLearnMore={() => handleScoreClick("overall", insights.overall_score)}
            />
            <ScoreCard
              title="Strategy"
              score={insights.strategy_score}
              description="Clarity, positioning, and strategic alignment."
              onLearnMore={() => handleScoreClick("strategy", insights.strategy_score)}
            />
            <ScoreCard
              title="Process"
              score={insights.process_score}
              description="Consistency, execution, and scalability."
              onLearnMore={() => handleScoreClick("process", insights.process_score)}
            />
            <ScoreCard
              title="Technology"
              score={insights.technology_score}
              description="Growth, automation, and efficiency."
              onLearnMore={() => handleScoreClick("technology", insights.technology_score)}
            />
          </div>
        </div>

        <ScoreContextModal open={!!modalData} onClose={() => setModalData(null)} data={modalData} />

        {/* Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExecutiveRadarChart
            strategy={insights.strategy_score}
            process={insights.process_score}
            technology={insights.technology_score}
            industryAvg={insights.industryAvgScore}
            topPerformer={insights.topPerformerScore}
          />
          <div className="space-y-6">
            <InsightCard 
              title="🚀 30-Day Growth Plan" 
              items={insights.roadmap.map(item => ({ 
                label: item.task, 
                detail: item.expectedImpact 
              }))} 
            />
            <GrowthChart data={insights.chartData} />
          </div>
        </div>

        {/* Strengths & Weaknesses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightCard 
            title="✅ Key Strengths" 
            items={insights.strengths.map(item => ({ 
              label: item.title, 
              detail: item.impact 
            }))} 
          />
          <InsightCard 
            title="🚨 Areas for Improvement" 
            items={insights.weaknesses.map(item => ({ 
              label: item.title, 
              detail: item.impact 
            }))} 
          />
        </div>

        {/* Market Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarketInsightCard industry={(insights.industry || "other").trim().toLowerCase()} />
          <BusinessTrendCard />
          <MarketingPlaybookCard />
        </div>
      </div>
    </div>
  );
}