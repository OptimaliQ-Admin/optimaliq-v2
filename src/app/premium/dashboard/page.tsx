// File: src/app/premium/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import axios from "axios";
import { motion } from "framer-motion";
import InsightLoading from "@/components/dashboard/InsightLoading";
import SectionHeader from "@/components/dashboard/SectionHeader";
import ScoreCard from "@/components/dashboard/ScoreCard";
import InsightCard from "@/components/dashboard/InsightCard";
import GrowthChart from "@/components/dashboard/GrowthChart";
import PerformanceFunnelChart from "@/components/dashboard/PerformanceFunnelChart";
import ScoreContextModal from "@/components/dashboard/ScoreContextModal";
import BusinessTrendCard from "@/components/dashboard/BusinessTrendCard";
import MarketingPlaybookCard from "@/components/dashboard/MarketingPlaybookCard";
import DashboardExplanationModal from "@/components/modals/DashboardExplanationModal";
import PageNavigation from "@/components/shared/PageNavigation";
import dynamic from "next/dynamic";
import { DashboardInsights } from "@/lib/types/DashboardInsights";
import { supabase } from "@/lib/supabase";

const MarketInsightCard = dynamic(() => import("@/components/dashboard/EnhancedMarketInsightCard"), { ssr: false });

interface ProfileData {
  dashboard_explanation_seen_at: string | null;
}

export default function PremiumDashboardPage() {
  const { user } = usePremiumUser();
  const u_id = user?.u_id;

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [welcomeData, setWelcomeData] = useState({ firstName: '', quote: '', author: '' });
  const [showWelcome, setShowWelcome] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDashboardExplanation, setShowDashboardExplanation] = useState(false);

  // Define page sections for navigation
  const pageSections = [
    { id: "score-overview", label: "Score Overview", icon: "🏆" },
    { id: "performance-summary", label: "Performance Summary", icon: "📊" },
    { id: "growth-analysis", label: "Growth Analysis", icon: "📈" },
    { id: "performance-insights", label: "Performance Insights", icon: "💡" },
    { id: "market-intelligence", label: "Market Intelligence", icon: "🌍" },
  ];

  // Check if welcome message has been shown in this session
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('dashboard_welcome_shown');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      sessionStorage.setItem('dashboard_welcome_shown', 'true');
    }
  }, []);

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

  // Check if user has seen dashboard explanation
  useEffect(() => {
    if (!u_id) return;

    const checkDashboardExplanation = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("tier2_profiles")
          .select("dashboard_explanation_seen_at")
          .eq("u_id", u_id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
          return;
        }

        const hasSeenExplanation = (profileData as ProfileData).dashboard_explanation_seen_at !== null;
        
        if (!hasSeenExplanation) {
          setShowDashboardExplanation(true);
        }
      } catch (err) {
        console.error("Error checking dashboard explanation status:", err);
      }
    };

    checkDashboardExplanation();
  }, [u_id]);

  // Auto-dismiss welcome message after 5 minutes
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

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

  const overallPerformance = ((insights.strategy_score + insights.process_score + insights.technology_score) / 3 / insights.topPerformerScore) * 100;
  const industryPosition = ((insights.strategy_score + insights.process_score + insights.technology_score) / 3 / insights.industryAvgScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Explanation Modal */}
      <DashboardExplanationModal
        isOpen={showDashboardExplanation}
        onClose={() => setShowDashboardExplanation(false)}
        userId={u_id}
      />

      {/* Floating Page Navigation */}
      <PageNavigation sections={pageSections} />

      {/* Enhanced Welcome Toast */}
      {showWelcome && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 max-w-sm backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome back, {welcomeData.firstName || 'there'}! 👋
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  &ldquo;{welcomeData.quote}&rdquo;
                </p>
                <p className="text-gray-500 text-xs mt-2 font-medium">
                  — {welcomeData.author}
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-[1920px] mx-auto p-8 space-y-10">
        {/* Assessment Reminder */}
        {insights.promptRetake && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 text-xl">🕒</div>
              <div>
                <p className="font-semibold text-lg">Time to retake your assessment</p>
                <p className="text-sm mt-2 leading-relaxed">
                  Your last assessment was over 30 days ago. Please {" "}
                  <a href="/premium/onboarding/initial-assessment" className="underline font-semibold text-yellow-700 hover:text-yellow-900 transition-colors duration-200">
                    retake your assessment
                  </a>
                  {" "}to keep your insights current.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Score Overview Section */}
        <motion.section 
          id="score-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <SectionHeader title="🏆 Business Score Overview" subtitle="Your comprehensive growth maturity assessment across key business areas" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScoreCard
              title="Overall Score"
              icon="🏆"
              score={insights.overall_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Your comprehensive growth maturity score"
              onLearnMore={() => handleScoreClick("overall", insights.overall_score)}
            />
            <ScoreCard
              title="Strategy"
              icon="🎯"
              score={insights.strategy_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Clarity, positioning, and strategic alignment."
              onLearnMore={() => handleScoreClick("strategy", insights.strategy_score)}
            />
            <ScoreCard
              title="Process"
              icon="⚙️"
              score={insights.process_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Consistency, execution, and scalability."
              onLearnMore={() => handleScoreClick("process", insights.process_score)}
            />
            <ScoreCard
              title="Technology"
              icon="🚀"
              score={insights.technology_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Growth, automation, and efficiency."
              onLearnMore={() => handleScoreClick("technology", insights.technology_score)}
            />
          </div>
        </motion.section>

        {/* Performance Summary Section */}
        <motion.section 
          id="performance-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">📊</div>
            <h4 className="font-bold text-gray-900 text-xl">Performance Summary</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors duration-200">
                +{Math.round(industryPosition - 100)}%
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Above Industry Average</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                You&apos;re performing {Math.round(industryPosition - 100)}% better than the typical company in your industry
              </div>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                {Math.round(overallPerformance)}%
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-2">of Top Performer Level</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                You&apos;re operating at {Math.round(overallPerformance)}% of what the best companies in your industry achieve
              </div>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:text-purple-700 transition-colors duration-200">
                Top {Math.round(100 - overallPerformance)}%
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Industry Percentile</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                You&apos;re in the top {Math.round(100 - overallPerformance)}% of companies in your industry
              </div>
            </div>
          </div>
        </motion.section>

        <ScoreContextModal open={!!modalData} onClose={() => setModalData(null)} data={modalData} />

        {/* Analysis Section */}
        <motion.section 
          id="growth-analysis"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <SectionHeader title="📈 Growth Analysis & Planning" subtitle="Strategic insights and actionable growth recommendations" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <InsightCard 
                title="🚀 30-Day Growth Plan" 
                items={insights.roadmap.map(item => ({ 
                  label: item.task, 
                  detail: item.expectedImpact 
                }))} 
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <GrowthChart data={insights.chartData} />
              <PerformanceFunnelChart 
                strategyScore={insights.strategy_score}
                processScore={insights.process_score}
                technologyScore={insights.technology_score}
                overallScore={insights.overall_score}
                industryAvg={insights.industryAvgScore}
                topPerformer={insights.topPerformerScore}
              />
            </div>
          </div>
        </motion.section>

        {/* Strengths & Weaknesses Section */}
        <motion.section 
          id="performance-insights"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-8"
        >
          <SectionHeader title="🎯 Performance Insights" subtitle="Key strengths to leverage and areas for strategic improvement" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </motion.section>

        {/* Market Insights Section */}
        <motion.section 
          id="market-intelligence"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <SectionHeader title="🌍 Market Intelligence" subtitle="Real-time insights and strategic market guidance" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MarketInsightCard industry={(insights.industry || "other").trim().toLowerCase()} />
            <BusinessTrendCard />
            <MarketingPlaybookCard />
          </div>
        </motion.section>
      </div>
    </div>
  );
}