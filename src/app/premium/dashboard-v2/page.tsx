"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import axios from "axios";
import dynamic from "next/dynamic";
import InsightLoading from "@/components/dashboard/InsightLoading";
import ScoreCard from "@/components/dashboard/ScoreCard";
import BusinessTrendCard from "@/components/dashboard/BusinessTrendCard";
import EngagementIntelligenceCard from "@/components/dashboard/EngagementIntelligenceCard";
import PerformanceFunnelChart from "@/components/dashboard/PerformanceFunnelChart";
import { DashboardInsights } from "@/lib/types/DashboardInsights";

const MarketInsightCard = dynamic(() => import("@/components/dashboard/EnhancedMarketInsightCard"), { ssr: false });

export default function DashboardV2Page() {
  const { user } = usePremiumUser();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'analysis'|'market'|'tasks'>('overview');

  useEffect(() => {
    if (!userId) return;
    const run = async () => {
      try {
        const res = await axios.post("/api/dashboard", { u_id: userId });
        if (res.data.error) setError(res.data.error);
        else setInsights(res.data);
      } catch {
        setError("Unable to fetch dashboard insights.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId]);

  if (!userId || loading) return <InsightLoading />;
  if (error) return <p className="text-center text-red-600 p-10">{error}</p>;
  if (!insights) return null;

  const avgScore = ((insights.strategy_score || 0) + (insights.process_score || 0) + (insights.technology_score || 0)) / 3;
  const denomTop = insights.topPerformerScore && insights.topPerformerScore > 0 ? insights.topPerformerScore : 4.5;
  const denomIndustry = insights.industryAvgScore && insights.industryAvgScore > 0 ? insights.industryAvgScore : 3.2;
  const overallPerformance = Math.round((avgScore / denomTop) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* App header mimic (Salesforce style) */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600" />
            <div className="font-semibold">Dashboard v2</div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Overall</span>
            <span className="px-2 py-1 rounded bg-gray-100 font-semibold">{insights.overall_score?.toFixed?.(1)}</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-t">
          <div className="max-w-[1400px] mx-auto px-4">
            <nav className="flex gap-6 text-sm">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'analysis', label: 'Analysis' },
                { key: 'market', label: 'Market' },
                { key: 'tasks', label: 'Tasks' },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key as any)} className={`h-10 border-b-2 -mb-px ${activeTab===t.key? 'border-blue-600 text-blue-700':'border-transparent text-gray-600 hover:text-gray-800'}`}>{t.label}</button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Left vertical nav mimic */}
        <aside className="hidden lg:block col-span-2">
          <div className="border rounded-xl overflow-hidden">
            <div className="px-3 py-2 text-xs font-semibold tracking-wide bg-gray-50 border-b">Navigation</div>
            <nav className="p-2 text-sm">
              <a className={`block px-3 py-2 rounded ${activeTab==='overview'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('overview')}>Highlights</a>
              <a className={`block px-3 py-2 rounded ${activeTab==='analysis'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('analysis')}>Performance</a>
              <a className={`block px-3 py-2 rounded ${activeTab==='market'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('market')}>Market</a>
              <a className={`block px-3 py-2 rounded ${activeTab==='tasks'?'bg-blue-50 text-blue-700':'hover:bg-gray-50'}`} onClick={() => setActiveTab('tasks')}>Insights & Tasks</a>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <section className="col-span-12 lg:col-span-10 space-y-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-4">
              {/* Highlights metric cards */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <ScoreCard title="Overall" icon="🏆" score={insights.overall_score} industryAvg={insights.industryAvgScore} topPerformer={insights.topPerformerScore} description="Overall maturity" onLearnMore={() => {}} />
                <ScoreCard title="Strategy" icon="🎯" score={insights.strategy_score} industryAvg={insights.industryAvgScore} topPerformer={insights.topPerformerScore} description="Strategy maturity" onLearnMore={() => {}} />
                <ScoreCard title="Process" icon="⚙️" score={insights.process_score} industryAvg={insights.industryAvgScore} topPerformer={insights.topPerformerScore} description="Process maturity" onLearnMore={() => {}} />
                <ScoreCard title="Technology" icon="🚀" score={insights.technology_score} industryAvg={insights.industryAvgScore} topPerformer={insights.topPerformerScore} description="Technology maturity" onLearnMore={() => {}} />
              </div>

              {/* Compact cards */}
              <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Performance</div>
                  <div className="text-3xl font-bold text-blue-600">{overallPerformance}%</div>
                  <div className="text-xs text-gray-500">of top performer benchmark</div>
                </div>
                <div className="border rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Industry Avg</div>
                  <div className="text-3xl font-bold text-green-600">{insights.industryAvgScore?.toFixed?.(1) ?? '—'}</div>
                  <div className="text-xs text-gray-500">Comparative baseline</div>
                </div>
                <div className="border rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Roadmap Items</div>
                  <div className="text-3xl font-bold text-purple-600">{(insights.roadmap || []).length}</div>
                  <div className="text-xs text-gray-500">Active 30-day initiatives</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-7 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">Funnel & Benchmarks</div>
                <PerformanceFunnelChart 
                  strategyScore={insights.strategy_score}
                  processScore={insights.process_score}
                  technologyScore={insights.technology_score}
                  overallScore={insights.overall_score}
                  industryAvg={insights.industryAvgScore}
                  topPerformer={insights.topPerformerScore}
                />
              </div>
              <div className="col-span-12 xl:col-span-5 grid grid-cols-1 gap-4">
                <div className="border rounded-xl p-4">
                  <div className="text-sm font-semibold mb-2">Strengths</div>
                  <ul className="text-sm space-y-1">
                    {(insights.strengths||[]).slice(0,5).map((s,i)=> (
                      <li key={i} className="flex items-start gap-2"><span className="text-green-600 mt-0.5">●</span><span>{s.title}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-xl p-4">
                  <div className="text-sm font-semibold mb-2">Areas for Improvement</div>
                  <ul className="text-sm space-y-1">
                    {(insights.weaknesses||[]).slice(0,5).map((w,i)=> (
                      <li key={i} className="flex items-start gap-2"><span className="text-red-600 mt-0.5">●</span><span>{w.title}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-4 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">Market Signals</div>
                <MarketInsightCard industry={(insights.industry || "other").trim().toLowerCase()} />
              </div>
              <div className="col-span-12 xl:col-span-4 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">Business Trends</div>
                <BusinessTrendCard />
              </div>
              <div className="col-span-12 xl:col-span-4 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">Engagement Intelligence</div>
                <EngagementIntelligenceCard industry={(insights.industry || "general").trim().toLowerCase()} />
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-6 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">30-Day Growth Plan</div>
                <ul className="text-sm space-y-2">
                  {(insights.roadmap||[]).map((r,i)=> (
                    <li key={i} className="flex items-start gap-2"><span className="text-purple-600 mt-0.5">◆</span><div><div className="font-medium">{r.task}</div><div className="text-gray-600 text-xs">{r.expectedImpact}</div></div></li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 xl:col-span-6 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-3">Benchmarking Notes</div>
                <div className="text-sm text-gray-700">Industry Avg: {insights.industryAvgScore?.toFixed?.(1)} • Top Performer: {insights.topPerformerScore?.toFixed?.(1)}</div>
                <div className="mt-2 text-xs text-gray-500">Use these targets to calibrate quarterly objectives and track uplift after executing tasks.</div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


