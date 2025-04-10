"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import TrendInsightCard from "@/components/growthstudio/TrendInsightCard";
import SimulatorPanel from "@/components/growthstudio/SimulatorPanel";
import SimulationResults, { SimulationResult } from "@/components/growthstudio/SimulationResults";
import SectionHeader from "@/components/growthstudio/SectionHeader";

function GrowthStudioComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  if (!email) {
    return <p className="text-center text-red-600">⚠️ Email is required to access the Growth Studio.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <SectionHeader
        title="📈 Growth Studio"
        subtitle="Explore curated trends and simulate how strategic improvements could impact your business."
      />

      <section>
        <TrendInsightCard />
      </section>

      <section>
        <SimulatorPanel onResult={setSimulationResult} />
      </section>

      {simulationResult && (
        <section>
          <SimulationResults results={simulationResult} />
        </section>
      )}
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
