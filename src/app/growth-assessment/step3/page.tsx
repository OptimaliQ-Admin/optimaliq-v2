"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ScoreCardGrid from "../../../components/growthAssessment/step3/ScoreCardGrid";
import ScoreLineChart from "../../../components/growthAssessment/step3/ScoreLineChart";
import ScoreInsightGrid from "../../../components/growthAssessment/step3/ScoreInsightGrid";
import SocialProofCard from "@/components/growthAssessment/step3/SocialProofCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { showToast } from "@/lib/utils/toast";
import SubscriptionPopup from "@/components/modals/SubscriptionPopup";
import { motion } from "framer-motion";
import { 
  CheckCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// Create service role client for growth assessment flow
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Using anon key for client-side
);

function Step3Component() {
  const router = useRouter();
  const hasFetched = useRef(false);

  const [score, setScore] = useState<number>(0);
  const [insights, setInsights] = useState<{ [key: string]: string }>({
    strategy: "Complete the assessment to receive insights.",
    process: "Complete the assessment to receive insights.",
    technology: "Complete the assessment to receive insights.",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [roadmapData, setRoadmapData] = useState<{ month: string; score: number }[]>([]);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const u_id = typeof window !== "undefined" ? localStorage.getItem("u_id") : null;
    if (!u_id) {
      showToast.error("User session expired. Please start again.");
      router.push("/growth-assessment");
      return;
    }

    fetchInsights(u_id);
  }, [router]);

  // Timer for subscription popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionPopup(true);
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  const fetchInsights = async (u_id: string) => {
    setLoading(true);
    try {
      // Use API endpoint instead of direct client access to bypass RLS
      const response = await fetch('/api/growth-assessment/get-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id }),
      });

      if (!response.ok) {
        console.error('Failed to fetch insights');
        return;
      }

      const data = await response.json();
      
      if (!data) {
        return;
      }

      const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;
      const roundedScore = roundToNearestHalf(data.overall_score ?? 0);

      setScore(roundedScore);
      setInsights({
        strategy: data.strategy_insight || insights.strategy,
        process: data.process_insight || insights.process,
        technology: data.technology_insight || insights.technology,
      });

      setRoadmapData([
        { month: "Now", score: roundedScore },
        { month: "3 Months", score: Math.min(5, roundedScore + 0.5) },
        { month: "6 Months", score: Math.min(5, roundedScore + 1) },
        { month: "12 Months", score: Math.min(5, roundedScore + 2) },
      ]);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
      localStorage.removeItem("u_id");
    }
  };

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false);
  };

  const handleSubscribeClick = () => {
    router.push("/subscribe");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Floating Subscribe Button */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
        >
          <button
            onClick={handleSubscribeClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
          >
            <div className="flex flex-col items-center gap-1">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-semibold whitespace-nowrap">Unlock Pro</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">→</span>
            </div>
          </button>
        </motion.div>

        {/* Hero Section with Conversion Focus */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              {/* Success Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span>Analysis Complete</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Your Growth Analysis is{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ready
                </span>
              </motion.h1>
              
              {/* Subheadline with Value Props */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                Join 2,000+ businesses using OptimaliQ to get ongoing insights, 
                real-time benchmarks, and AI-powered growth strategies.
              </motion.p>

              {/* Value Propositions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
                  <p className="text-gray-600">Track your progress with live benchmarks and industry comparisons</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600">Get personalized recommendations that drive measurable results</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CurrencyDollarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven ROI</h3>
                  <p className="text-gray-600">Average 3x faster growth and 40% efficiency improvements</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-10">
        <Tabs defaultValue="overview">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="growth">Growth Chart</TabsTrigger>
              <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScoreCardGrid score={score} />
              </div>
              <div>
                <SocialProofCard />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="growth">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ScoreLineChart data={roadmapData} score={score} />
            </motion.div>
          </TabsContent>

          <TabsContent value="insights">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ScoreInsightGrid loading={loading} insights={insights} />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Conversion Section now below tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get unlimited access to AI-powered insights, real-time benchmarks, and personalized growth strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center gap-3 text-blue-100">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <CheckCircleIcon className="w-6 h-6" />
                <span>No long-term contracts</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSubscriptionPopup(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Unlock Your Full Potential
            </button>
          </div>
        </motion.div>
      </div>
      </div>

      {/* Subscription Popup */}
      <SubscriptionPopup
        isOpen={showSubscriptionPopup}
        onClose={handleCloseSubscriptionPopup}
      />
    </>
  );
}

export default function Step3Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading your insights...</p>
        </div>
      </div>
    }>
      <Step3Component />
    </Suspense>
  );
}
