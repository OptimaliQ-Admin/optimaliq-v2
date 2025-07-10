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
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { DashboardInsights } from "@/lib/types/DashboardInsights";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

// Dynamic imports for better performance
const EnterpriseScoreCard = dynamic(() => import("@/components/dashboard/EnterpriseScoreCard"), { ssr: false });
const EnterpriseInsightCard = dynamic(() => import("@/components/dashboard/EnterpriseInsightCard"), { ssr: false });
const EnterpriseChart = dynamic(() => import("@/components/dashboard/EnterpriseChart"), { ssr: false });
const EnterpriseTrendCard = dynamic(() => import("@/components/dashboard/EnterpriseTrendCard"), { ssr: false });
const EnterpriseMarketCard = dynamic(() => import("@/components/dashboard/EnterpriseMarketCard"), { ssr: false });
const EnterpriseLoading = dynamic(() => import("@/components/dashboard/EnterpriseLoading"), { ssr: false });

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
  const [error, setError] = useState<string | null>(null);
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
          setLastUpdated(new Date());
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
      {/* Enterprise Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
                  <p className="text-sm text-gray-500">Real-time insights and strategic analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <BellIcon className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <UserCircleIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.first_name || 'User'}</span>
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 max-w-sm backdrop-blur-sm">
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
      </AnimatePresence>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Assessment Reminder */}
        {insights.promptRetake && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <InformationCircleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Assessment Update Required</h3>
                <p className="text-amber-800 mb-4">
                  Your last assessment was over 30 days ago. Please retake your assessment to keep your insights current and accurate.
                </p>
                <a 
                  href="/premium/onboarding/initial-assessment" 
                  className="inline-flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium"
                >
                  <span>Retake Assessment</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Score Overview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h2>
              <p className="text-gray-600">Your comprehensive business maturity assessment across key areas</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnterpriseScoreCard
              title="Overall Score"
              score={insights.overall_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Comprehensive growth maturity"
              trend="up"
              trendValue="+12%"
              icon="🏆"
            />
            <EnterpriseScoreCard
              title="Strategy"
              score={insights.strategy_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Clarity and positioning"
              trend="up"
              trendValue="+8%"
              icon="🎯"
            />
            <EnterpriseScoreCard
              title="Process"
              score={insights.process_score}
              industryAvg={insights.industryAvgScore}
              topPerformer={insights.topPerformerScore}
              description="Execution and scalability"
              trend="down"
              trendValue="-3%"
              icon="⚙️"
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
            />
          </div>
        </motion.section>

        {/* Performance Analysis Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Growth Trends</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              <EnterpriseChart 
                data={insights.chartData || []}
                type="line"
                height={300}
              />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Funnel</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Conversion rates</span>
                </div>
              </div>
              <EnterpriseChart 
                data={insights.chartData || []}
                type="funnel"
                height={300}
              />
            </div>
          </div>
        </motion.section>

        {/* Insights Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategic Insights</h2>
              <p className="text-gray-600">Key strengths to leverage and areas for improvement</p>
            </div>
            <div className="flex items-center space-x-2">
              <LightBulbIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">AI-Powered</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnterpriseInsightCard 
              title="Key Strengths"
              items={insights.strengths.map(item => ({ 
                label: item.title, 
                detail: item.impact,
                type: 'strength'
              }))}
              icon="✅"
              color="green"
            />
            <EnterpriseInsightCard 
              title="Areas for Improvement"
              items={insights.weaknesses.map(item => ({ 
                label: item.title, 
                detail: item.impact,
                type: 'improvement'
              }))}
              icon="🚨"
              color="red"
            />
          </div>
        </motion.section>

        {/* Market Intelligence Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Intelligence</h2>
              <p className="text-gray-600">Real-time market insights and strategic guidance</p>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EnterpriseMarketCard industry={(insights.industry || "other").trim().toLowerCase()} />
            <EnterpriseTrendCard />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Marketing Playbook</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">MP</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                AI-generated marketing strategies tailored to your industry and performance data.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                View Playbook
              </button>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Run Assessment</p>
                  <p className="text-sm text-gray-500">Update your scores</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Growth Studio</p>
                  <p className="text-sm text-gray-500">Explore scenarios</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <LightBulbIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Get Insights</p>
                  <p className="text-sm text-gray-500">AI recommendations</p>
                </div>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}