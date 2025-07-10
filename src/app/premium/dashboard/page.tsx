// File: src/app/premium/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import axios from "axios";
import { motion } from "framer-motion";
import InsightLoading from "@/components/dashboard/InsightLoading";
import EnterpriseDashboardHeader from "@/components/dashboard/EnterpriseDashboardHeader";
import EnterpriseScoreCard from "@/components/dashboard/EnterpriseScoreCard";
import EnterpriseInsightCard from "@/components/dashboard/EnterpriseInsightCard";
import EnterprisePerformanceSummary from "@/components/dashboard/EnterprisePerformanceSummary";
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
import { 
  TrophyIcon,
  TagIcon,
  CogIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const MarketInsightCard = dynamic(() => import("@/components/dashboard/MarketInsightCard"), { ssr: false });

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

  // Performance metrics for the summary component
  const performanceMetrics = [
    {
      label: "Above Industry Average",
      value: Math.round(industryPosition - 100),
      unit: "%",
      trend: Math.round(industryPosition - 100),
      description: `You're performing ${Math.round(industryPosition - 100)}% better than the typical company in your industry`,
      color: "#10b981",
      icon: ArrowTrendingUpIcon
    },
    {
      label: "Top Performer Level",
      value: Math.round(overallPerformance),
      unit: "%",
      trend: Math.round(overallPerformance) - 50,
      description: `You're operating at ${Math.round(overallPerformance)}% of what the best companies in your industry achieve`,
      color: "#3b82f6",
      icon: StarIcon
    },
    {
      label: "Industry Percentile",
      value: Math.round(100 - overallPerformance),
      unit: "%",
      trend: Math.round(100 - overallPerformance) - 50,
      description: `You're in the top ${Math.round(100 - overallPerformance)}% of companies in your industry`,
      color: "#8b5cf6",
      icon: TrophyIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 max-w-sm">
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

      <div className="max-w-[1920px] mx-auto p-8 space-y-12">
        {/* Assessment Reminder */}
        {insights.promptRetake && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-2xl shadow-lg backdrop-blur-sm"
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

        {/* Enterprise Dashboard Header */}
        <EnterpriseDashboardHeader
          title="Business Intelligence Dashboard"
          subtitle="Comprehensive growth maturity assessment and strategic insights"
          lastUpdated={new Date().toISOString()}
          refreshInterval={300000} // 5 minutes
          onRefresh={() => window.location.reload()}
          user={{
            name: user?.first_name,
            email: user?.email
          }}
          notifications={3}
        />

        {/* Score Overview Section */}
        <motion.section 
          id="score-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🏆 Business Score Overview</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your comprehensive growth maturity assessment across key business areas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <EnterpriseScoreCard
              title="Overall Score"
              icon="🏆"
              score={insights.overall_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Your comprehensive growth maturity score"
              onLearnMore={() => handleScoreClick("overall", insights.overall_score)}
              category="overall"
            />
            <EnterpriseScoreCard
              title="Strategy"
              icon="🎯"
              score={insights.strategy_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Clarity, positioning, and strategic alignment."
              onLearnMore={() => handleScoreClick("strategy", insights.strategy_score)}
              category="strategy"
            />
            <EnterpriseScoreCard
              title="Process"
              icon="⚙️"
              score={insights.process_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Consistency, execution, and scalability."
              onLearnMore={() => handleScoreClick("process", insights.process_score)}
              category="process"
            />
            <EnterpriseScoreCard
              title="Technology"
              icon="🚀"
              score={insights.technology_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Growth, automation, and efficiency."
              onLearnMore={() => handleScoreClick("technology", insights.technology_score)}
              category="technology"
            />
          </div>
        </motion.section>

        {/* Performance Summary Section */}
        <motion.section 
          id="performance-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          <EnterprisePerformanceSummary metrics={performanceMetrics} />
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">📈 Growth Analysis & Planning</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Strategic insights and actionable growth recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <EnterpriseInsightCard 
                title="🚀 30-Day Growth Plan" 
                items={insights.roadmap.map(item => ({ 
                  label: item.task, 
                  detail: item.expectedImpact,
                  priority: 'high' as const,
                  impact: 'positive' as const
                }))} 
                type="roadmap"
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🎯 Performance Insights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key strengths to leverage and areas for strategic improvement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EnterpriseInsightCard 
              title="✅ Key Strengths" 
              items={insights.strengths.map(item => ({ 
                label: item.title, 
                detail: item.impact,
                impact: 'positive' as const
              }))} 
              type="strengths"
            />
            <EnterpriseInsightCard 
              title="🚨 Areas for Improvement" 
              items={insights.weaknesses.map(item => ({ 
                label: item.title, 
                detail: item.impact,
                impact: 'negative' as const
              }))} 
              type="weaknesses"
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🌍 Market Intelligence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time insights and strategic market guidance
            </p>
          </div>
          
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