"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function MarketInsightCard({ industry }: { industry: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch(`/api/tier2/dashboard/insight/market_trends?industry=${encodeURIComponent(industry)}`);
        const data = await res.json();

        if (data?.insight && data?.createdat) {
          const created = new Date(data.createdat);
          const now = new Date();
          const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

          if (diffInDays <= 7) {
            setInsight(data.insight);
            setLastUpdated(format(created, "MMMM d, yyyy"));
          } else {
            // Trigger background refresh (non-blocking)
            fetch("/api/cron/generateMarketInsight");
            setInsight(data.insight); // Show stale data
            setLastUpdated(format(created, "MMMM d, yyyy (stale)"));
          }
        } else {
          console.warn("No valid insight found");
        }
      } catch (error) {
        console.error("Error fetching market insight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [industry]);

  const renderFormattedInsight = (insight: string) => {
    const splitPoint = "🎯 Strategic Outlook for Growth Companies:";
    const [summary, strategySectionRaw] = insight.split(splitPoint);

    if (!strategySectionRaw) return <p className="text-gray-600 mt-2 whitespace-pre-line">{insight}</p>;

    return (
      <>
        <p className="text-gray-600 mt-2 whitespace-pre-line">{summary.trim()}</p>
        <p className="text-gray-600 mt-4 font-semibold">{splitPoint}</p>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="text-sm text-blue-600 mt-2 font-medium hover:underline"
          >
            Learn more →
          </button>
        ) : (
          <>
            <p className="text-gray-600 mt-2 whitespace-pre-line">{strategySectionRaw.trim()}</p>
            <button
              onClick={() => setCollapsed(true)}
              className="text-sm text-blue-600 mt-4 font-medium hover:underline"
            >
              Show less ▲
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-700">📊 Market Trend Prediction</h2>
      {loading ? (
        <p className="text-gray-400 mt-2 animate-pulse">Loading latest insight...</p>
      ) : insight ? (
        <>
          {renderFormattedInsight(insight)}
          {lastUpdated && (
            <p className="mt-4 text-xs text-gray-400">
              Last updated: {lastUpdated}
              {lastUpdated?.includes("stale") && (
                <span className="ml-2 text-xs text-yellow-600 italic">refreshing...</span>
              )}
            </p>
          )}
        </>
      ) : (
        <p className="text-red-500 mt-2">⚠️ No market insight available</p>
      )}
    </div>
  );
}
