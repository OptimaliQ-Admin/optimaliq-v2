"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog } from "@headlessui/react";

import TrendInsightCard from "@/components/growthstudio/TrendInsightCard";
import SimulatorPanel from "@/components/growthstudio/SimulatorPanel";
import SimulationResults, { SimulationResult } from "@/components/growthstudio/SimulationResults";
import SectionHeader from "@/components/growthstudio/SectionHeader";

function GrowthStudioComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleRunSimulation = async (result: SimulationResult | null) => {
    if (!result) return;
  
    setSimulationResult(result);
  
    try {
      const res = await fetch("/api/tier2/growth_studio/commentary", {
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
  
    // ⏳ Add delay to allow GPT results to load cleanly before modal opens
    setTimeout(() => setShowModal(true), 500); // 500ms to 750ms feels smooth
  };

  if (!email) {
    return <p className="text-center text-red-600">⚠️ Email is required to access the Growth Studio.</p>;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-3xl space-y-10">
        <SectionHeader
          title="📈 Growth Studio"
          subtitle="Explore curated trends and simulate how strategic improvements could impact your business."
        />

        <section>
          <TrendInsightCard />
        </section>

        <section>
          <SimulatorPanel onResult={handleRunSimulation} />
        </section>

        {/* 📊 Simulation Results Modal */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl">
              <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
                📊 Simulation Results
              </Dialog.Title>

              {simulationResult && <SimulationResults results={simulationResult} />}

              {aiInsight && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    💡 <strong>Strategic Insight:</strong><br />{aiInsight}
                  </p>
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
    <Suspense fallback={<p>Loading Growth Studio...</p>}>
      <GrowthStudioComponent />
    </Suspense>
  );
}
