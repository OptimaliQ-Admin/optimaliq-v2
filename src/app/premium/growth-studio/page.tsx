//src/app/premium/growth-studio/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import InsightLoading from "@/components/dashboard/InsightLoading";
import GrowthStudioExplanationModal from "@/components/modals/GrowthStudioExplanationModal";
import { supabase } from "@/lib/supabase";

import TrendInsightCard from "@/components/growthstudio/TrendInsightCard";
import SimulatorPanel from "@/components/growthstudio/SimulatorPanel";
import SimulationResults, { SimulationResult } from "@/components/growthstudio/SimulationResults";
import SectionHeader from "@/components/growthstudio/SectionHeader";
import QuadrantChart from "@/components/growthstudio/QuadrantChart";
import GrowthLeversCard from "@/components/growthstudio/GrowthLeversCard";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

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
    <div className="w-full flex justify-center px-4">
      {/* Growth Studio Explanation Modal */}
      <GrowthStudioExplanationModal
        isOpen={showGrowthStudioExplanation}
        onClose={() => setShowGrowthStudioExplanation(false)}
        userId={userId}
      />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <SectionHeader
            title="📈 Growth Studio"
            subtitle="Explore curated trends and simulate how strategic improvements could impact your business."
          />

          <TrendInsightCard />

          <SimulatorPanel onResult={handleRunSimulation} />
        </div>

        <div className="space-y-8">
          <QuadrantChart userId={userId} />

          <GrowthLeversCard />
        </div>

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