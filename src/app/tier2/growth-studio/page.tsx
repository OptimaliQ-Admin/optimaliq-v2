"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Tier2Layout from "@/components/layouts/Tier2Layout";
import TrendInsightCard from "@/components/growthstudio/TrendInsightCard";
import SimulatorPanel from "@/components/growthstudio/SimulatorPanel";
import SimulationResults from "@/components/growthstudio/SimulationResults";
import SectionHeader from "@/components/growthstudio/SectionHeader";

interface SimulationResult {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
}

export default function GrowthStudioWrapper() {
  return (
    <Suspense fallback={<p>Loading Growth Studio...</p>}>
      <GrowthStudioPage />
    </Suspense>
  );
}

function GrowthStudioPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  return (
    <Tier2Layout email={email}>
      <div className="p-6 max-w-6xl mx-auto space-y-10">
        <SectionHeader
          title="📈 Growth Studio"
          subtitle="Explore curated trends and simulate how strategic improvements could impact your business."
        />

        {/* 🧠 Trends Section */}
        <section>
          <TrendInsightCard email={email} />
        </section>

        {/* ⚙️ Simulator Section */}
        <section>
          <SimulatorPanel onResult={setSimulationResult} />
        </section>

        {/* 📊 Simulation Output */}
        {simulationResult && (
          <section>
            <SimulationResults {...simulationResult} />
          </section>
        )}
      </div>
    </Tier2Layout>
  );
}
