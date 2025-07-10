// File: src/app/premium/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  LightBulbIcon, 
  GlobeAltIcon,
  ClockIcon,
  ArrowPathIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { DashboardInsights } from "@/lib/types/DashboardInsights";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

// Dynamic imports for better performance
const EnterpriseScoreCard = dynamic(() => import("@/components/dashboard/EnterpriseScoreCard"), { ssr: false });
const EnterpriseInsightCard = dynamic(() => import("@/components/dashboard/EnterpriseInsightCard"), { ssr: false });
const EnterpriseTrendCard = dynamic(() => import("@/components/dashboard/EnterpriseTrendCard"), { ssr: false });
const EnterpriseMarketCard = dynamic(() => import("@/components/dashboard/EnterpriseMarketCard"), { ssr: false });
const EnterpriseLoading = dynamic(() => import("@/components/dashboard/EnterpriseLoading"), { ssr: false });

// Original dashboard components
const GrowthChart = dynamic(() => import("@/components/dashboard/GrowthChart"), { ssr: false });
const PerformanceFunnelChart = dynamic(() => import("@/components/dashboard/PerformanceFunnelChart"), { ssr: false });
const ScoreContextModal = dynamic(() => import("@/components/dashboard/ScoreContextModal"), { ssr: false });
const BusinessTrendCard = dynamic(() => import("@/components/dashboard/BusinessTrendCard"), { ssr: false });
const MarketingPlaybookCard = dynamic(() => import("@/components/dashboard/MarketingPlaybookCard"), { ssr: false });
const MarketInsightCard = dynamic(() => import("@/components/dashboard/MarketInsightCard"), { ssr: false });
const DashboardExplanationModal = dynamic(() => import("@/components/modals/DashboardExplanationModal"), { ssr: false });

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    if (!u_id) return;
    setIsRefreshing(true);
    try {
      const res = await axios.post("/api/dashboard", { u_id });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setInsights(res.data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("Error refreshing insights:", err);
      setError("Unable to refresh dashboard insights.");
    } finally {
      setIsRefreshing(false);
    }
  };

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

  if (!u_id || loading) return <EnterpriseLoading />;
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!insights) return null;

  const overallPerformance = ((insights.strategy_score + insights.process_score + insights.technology_score) / 3 / insights.topPerformerScore) * 100;
  const industryPosition = ((insights.strategy_score + insights.process_score + insights.technology_score) / 3 / insights.industryAvgScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Dashboard Explanation Modal */}
      <DashboardExplanationModal
        isOpen={showDashboardExplanation}
        onClose={() => setShowDashboardExplanation(false)}
        userId={u_id}
      />

      {/* Enhanced Welcome Toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 max-w-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Welcome back{welcomeData.firstName ? `, ${welcomeData.firstName}` : ''}!
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {welcomeData.quote}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">— {welcomeData.author}</span>
                    <button
                      onClick={() => setShowWelcome(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <RocketLaunchIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Growth Command Center</h1>
                <p className="text-sm text-gray-600">Enterprise Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockIcon className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <BellIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
              <p className="text-gray-600">Real-time insights across all business dimensions</p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnterpriseScoreCard
              title="Strategy"
              score={insights.strategy_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Strategic planning & execution"
              trend="up"
              trendValue="+12%"
              icon="🎯"
              onClick={() => handleScoreClick('strategy', insights.strategy_score)}
            />
            
            <EnterpriseScoreCard
              title="Process"
              score={insights.process_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Operational efficiency"
              trend="stable"
              trendValue="+5%"
              icon="⚙️"
              onClick={() => handleScoreClick('process', insights.process_score)}
            />
            
            <EnterpriseScoreCard
              title="Technology"
              score={insights.technology_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Automation and efficiency"
              trend="up"
              trendValue="+15%"
              icon="🚀"
              onClick={() => handleScoreClick('technology', insights.technology_score)}
            />
          </div>
        </motion.section>

        {/* Performance Summary Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Summary</h3>
                <p className="text-gray-600">How you compare to industry benchmarks</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                <span>Real-time metrics</span>
              </div>
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
          </div>
        </motion.section>

        {/* Analysis Section */}
        <motion.section 
          id="growth-analysis"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Growth Analysis & Planning</h2>
              <p className="text-gray-600">Strategic insights and actionable growth recommendations</p>
            </div>
            <div className="flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">AI-Powered</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <EnterpriseInsightCard 
                title="🚀 30-Day Growth Plan" 
                items={insights.roadmap.map(item => ({ 
                  label: item.task, 
                  detail: item.expectedImpact,
                  type: 'strength' as const
                }))} 
                icon="📋"
                color="blue"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Key Strengths</h3>
                  <p className="text-sm text-gray-600">Areas where you excel</p>
                </div>
              </div>
              <div className="space-y-4">
                {insights.strengths.map((strength, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-semibold text-green-900 mb-1">{strength.title}</h4>
                    <p className="text-sm text-green-700">{strength.impact}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Improvement Areas</h3>
                  <p className="text-sm text-gray-600">Opportunities for growth</p>
                </div>
              </div>
              <div className="space-y-4">
                {insights.weaknesses.map((weakness, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-orange-900 mb-1">{weakness.title}</h4>
                    <p className="text-sm text-orange-700">{weakness.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Market Intelligence Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Intelligence</h2>
              <p className="text-gray-600">Industry insights and competitive analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BusinessTrendCard />
            <MarketingPlaybookCard />
          </div>
          
          <div className="mt-8">
            <MarketInsightCard industry={insights.industry || "other"} />
          </div>
        </motion.section>

        {/* Quick Actions Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">New Assessment</span>
              </button>
              
              <button className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Growth Studio</span>
              </button>
              
              <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <LightBulbIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">AI Insights</span>
              </button>
              
              <button className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Settings</span>
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Score Context Modal */}
      <ScoreContextModal open={!!modalData} onClose={() => setModalData(null)} data={modalData} />
    </div>
  );
}