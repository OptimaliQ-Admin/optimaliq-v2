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
import CompetitiveBenchmarkRadar from "@/components/dashboard/CompetitiveBenchmarkRadar";
// Salesforce-style shell: sticky header, tabs, left nav

interface ProfileData {
  growth_studio_explanation_seen_at: string | null;
}

function GrowthStudioComponent() {
  const { user } = usePremiumUser();
  const email = user?.email;
  const userId = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [showGrowthStudioExplanation, setShowGrowthStudioExplanation] = useState(false);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview'|'analysis'|'simulation'>(
    'overview'
  );

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
    <div className="min-h-screen bg-white">
      {/* Growth Studio Explanation Modal */}
      <GrowthStudioExplanationModal
        isOpen={showGrowthStudioExplanation}
        onClose={() => setShowGrowthStudioExplanation(false)}
        userId={userId}
      />

      {/* Sticky header + tabs (Salesforce style) */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600" />
            <div className="font-semibold">Growth Studio</div>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-[1400px] mx-auto px-4">
            <nav className="flex gap-6 text-sm">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'analysis', label: 'Analysis' },
                { key: 'simulation', label: 'Simulation' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`h-10 border-b-2 -mb-px ${activeTab===t.key? 'border-blue-600 text-blue-700':'border-transparent text-gray-600 hover:text-gray-800'}`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Workspace grid with left nav */}
      <main className="max-w-[1400px] mx-auto p-4 grid grid-cols-12 gap-4">
        <aside className="hidden lg:block col-span-2">
          <div className="border rounded-xl overflow-hidden">
            <div className="px-3 py-2 text-xs font-semibold tracking-wide bg-gray-50 border-b">Navigation</div>
            <nav className="p-2 text-sm">
              <a className={`block px-3 py-2 rounded ${activeTab==='overview'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('overview')}>Highlights</a>
              <a className={`block px-3 py-2 rounded ${activeTab==='analysis'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('analysis')}>Strategic Analysis</a>
              <a className={`block px-3 py-2 rounded ${activeTab==='simulation'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('simulation')}>Scenario Simulation</a>
            </nav>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-10 space-y-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="py-4">
                  <h1 className="text-2xl font-bold text-gray-900">🚀 Growth Studio</h1>
                  <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                    Your strategic command center for data-driven growth decisions. Explore trends, analyze positioning, and simulate scenarios.
                  </p>
                </div>
                <TrendInsightCard />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-6">
                <div className="text-sm font-semibold mb-3">Competitive Benchmarking</div>
                <CompetitiveBenchmarkRadar userId={userId} />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <div className="text-sm font-semibold mb-3">Strategic Analysis</div>
                <StrategicAnalysisCard userId={userId} />
              </div>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="text-sm font-semibold mb-3">Scenario Simulation</div>
                <WhatIfScenarioSimulator />
              </div>
            </div>
          )}

          {/* Growth Levers intentionally omitted from Growth Studio; now lives on Dashboard Tasks */}
        </section>
      </main>

      {/* Results modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">📊 Simulation Results</Dialog.Title>
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
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
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