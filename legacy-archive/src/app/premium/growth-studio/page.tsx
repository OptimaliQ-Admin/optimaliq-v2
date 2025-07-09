//src/app/premium/growth-studio/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import InsightLoading from "@/components/dashboard/InsightLoading";
import GrowthStudioExplanationModal from "@/components/modals/GrowthStudioExplanationModal";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

import TrendInsightCard from "@/components/growthstudio/TrendInsightCard";
import SimulationResults, { SimulationResult } from "@/components/growthstudio/SimulationResults";
import SectionHeader from "@/components/growthstudio/SectionHeader";
import StrategicAnalysisCard from "@/components/dashboard/StrategicAnalysisCard";
import WhatIfScenarioSimulator from "@/components/dashboard/WhatIfScenarioSimulator";
import GrowthLeversCard from "@/components/growthstudio/GrowthLeversCard";
import PageNavigation from "@/components/shared/PageNavigation";

interface ProfileData {
  growth_studio_explanation_seen_at: string | null;
}

function GrowthStudioComponent() {
  const { user } = usePremiumUser();
  const email = user?.email;
  const userId = user?.u_id;
  const [isLoading, setIsLoading] = useState(true);
  const [showGrowthStudioExplanation, setShowGrowthStudioExplanation] = useState(false);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Define page sections for navigation
  const pageSections = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "strategic-analysis", label: "Strategic Analysis", icon: "🎯" },
    { id: "simulation", label: "Scenario Simulation", icon: "🔮" },
    { id: "growth-levers", label: "Growth Levers", icon: "⚙️" },
  ];

  // Check if user has seen growth studio explanation
  useEffect(() => {
    if (!userId) return;

    const checkGrowthStudioExplanation = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("tier2_profiles")
          .select("growth_studio_explanation_seen_at")
          .eq("u_id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
          return;
        }

        const hasSeenExplanation = (profileData as ProfileData).growth_studio_explanation_seen_at !== null;
        
        if (!hasSeenExplanation) {
          setShowGrowthStudioExplanation(true);
        }
      } catch (err) {
        console.error("Error checking growth studio explanation status:", err);
      }
    };

    checkGrowthStudioExplanation();
  }, [userId]);

  const handleRunSimulation = async (result: SimulationResult | null) => {
    if (!result) return;

    setSimulationResult(result);
    setShowModal(true);

    try {
      const res = await fetch("/api/growth_studio/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = await res.json();
      setAiInsight(data.summary || null);
    } catch (err) {
      console.error("❌ Failed to fetch AI insight:", err);
      setAiInsight(null);
    }
  };

  useEffect(() => {
    // Simulate loading time for data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!email || !userId) {
    return <p className="text-center text-red-600">⚠️ Email and User ID are required to access the Growth Studio.</p>;
  }

  if (isLoading) {
    return <InsightLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Growth Studio Explanation Modal */}
      <GrowthStudioExplanationModal
        isOpen={showGrowthStudioExplanation}
        onClose={() => setShowGrowthStudioExplanation(false)}
        userId={userId}
      />

      {/* Floating Page Navigation */}
      <PageNavigation sections={pageSections} />

      <div className="max-w-[1920px] mx-auto p-8 space-y-10">
        {/* Header Section */}
        <motion.section 
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">🚀 Growth Studio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your strategic command center for data-driven growth decisions. Explore trends, analyze positioning, and simulate scenarios to accelerate your business growth.
            </p>
          </div>

          {/* Growth Trends Card - Full Width */}
          <TrendInsightCard />
        </motion.section>

        {/* Strategic Analysis Section */}
        <motion.section 
          id="strategic-analysis"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🎯 Strategic Analysis</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive competitive positioning and benchmark analysis to understand your market position
            </p>
          </div>
          
          <StrategicAnalysisCard userId={userId} />
        </motion.section>

        {/* Advanced Simulation Section */}
        <motion.section 
          id="simulation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🔮 Advanced Scenario Simulation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive what-if analysis with real-time impact visualization to test strategic decisions
            </p>
          </div>
          
          <WhatIfScenarioSimulator />
        </motion.section>

        {/* Growth Levers Section */}
        <motion.section 
          id="growth-levers"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">⚙️ Growth Levers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Strategic tools and insights to accelerate your growth with actionable initiatives
            </p>
          </div>
          
          <GrowthLeversCard />
        </motion.section>

        <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl">
              <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
                📊 Simulation Results
              </Dialog.Title>

              {simulationResult && <SimulationResults results={simulationResult} />}

              {aiInsight ? (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    💡 <strong>Strategic Insight:</strong><br />{aiInsight}
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
                  <p className="text-sm text-gray-500 italic">⏳ Generating insight...</p>
                </div>
              )}

              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default function GrowthStudioPage() {
  return (
    <Suspense fallback={<InsightLoading />}>
      <GrowthStudioComponent />
    </Suspense>
  );
}