"use client";
import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import dynamic from "next/dynamic";
import axios from "axios";

const GrowthChart = dynamic(() => import("@/components/dashboard/GrowthChart"), { ssr: false });
const PerformanceFunnelChart = dynamic(() => import("@/components/dashboard/PerformanceFunnelChart"), { ssr: false });
const MarketInsightCard = dynamic(() => import("@/components/dashboard/EnhancedMarketInsightCard"), { ssr: false });

export default function DashboardV2() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await axios.post("/api/dashboard", { u_id: userId });
        setData(res.data);
      } catch (e) {
        // noop
      } finally { setLoading(false); }
    })();
  }, [userId]);

  if (loading) return <div className="p-10">Loading…</div>;
  if (!data) return <div className="p-10 text-red-600">Unable to load</div>;

  const avgScore = ((data.strategy_score || 0) + (data.process_score || 0) + (data.technology_score || 0)) / 3;
  const denomTop = data.topPerformerScore && data.topPerformerScore > 0 ? data.topPerformerScore : 4.5;
  const overallPerformance = Math.round((avgScore / denomTop) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded border">Customize</button>
          <button className="px-3 py-2 rounded bg-blue-600 text-white">Actions</button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Executive KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Overall Score", value: data.overall_score?.toFixed?.(1) ?? "--" },
            { label: "Completion Rate", value: `${overallPerformance}%` },
            { label: "Strengths", value: (data.strengths || []).length },
            { label: "Open Actions", value: (data.roadmap || []).length },
          ].map((kpi, idx) => (
            <div key={idx} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition">
              <div className="text-sm text-gray-500">{kpi.label}</div>
              <div className="text-2xl font-semibold mt-1">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Workspace layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Growth Trajectory</h2>
                <div className="text-sm text-gray-500">Last 12 months</div>
              </div>
              <GrowthChart data={data.chartData} />
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Capability Funnel</h2>
                <div className="text-sm text-gray-500">Benchmark vs Top</div>
              </div>
              <PerformanceFunnelChart 
                strategyScore={data.strategy_score}
                processScore={data.process_score}
                technologyScore={data.technology_score}
                overallScore={data.overall_score}
                industryAvg={data.industryAvgScore}
                topPerformer={data.topPerformerScore}
              />
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Market Intelligence</h2>
                <div className="text-sm text-gray-500">Auto-updated</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MarketInsightCard industry={(data.industry || "other").trim().toLowerCase()} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold mb-3">30-Day Plan</h2>
              <ul className="space-y-2">
                {(data.roadmap || []).slice(0, 6).map((i: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                    <div>
                      <div className="text-sm font-medium">{i.task}</div>
                      <div className="text-xs text-gray-500">{i.expectedImpact}</div>
                    </div>
                  </li>
                ))}
                {(!data.roadmap || data.roadmap.length === 0) && <div className="text-sm text-gray-500">No actions yet.</div>}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold mb-3">Strengths & Risks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-green-700 mb-2">Strengths</div>
                  <ul className="space-y-2">
                    {(data.strengths || []).slice(0, 5).map((s: any, idx: number) => (
                      <li key={idx} className="text-sm">{s.title}</li>
                    ))}
                    {(!data.strengths || data.strengths.length === 0) && <div className="text-sm text-gray-500">No strengths listed.</div>}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-red-700 mb-2">Areas for Improvement</div>
                  <ul className="space-y-2">
                    {(data.weaknesses || []).slice(0, 5).map((w: any, idx: number) => (
                      <li key={idx} className="text-sm">{w.title}</li>
                    ))}
                    {(!data.weaknesses || data.weaknesses.length === 0) && <div className="text-sm text-gray-500">No risks listed.</div>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


