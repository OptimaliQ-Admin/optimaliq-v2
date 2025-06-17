//src/components/dashboard/MarketInsightCard.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import SectionTitleBar from "./SectionTitleBar";

export default function MarketInsightCard({ industry }: { industry: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch(`/api/dashboard/market_trends?industry=${encodeURIComponent(industry)}`);
        const data = await res.json();

        if (data?.insight && data?.createdat) {
          const created = new Date(data.createdat);
          const now = new Date();
          const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

          setInsight(data.insight);
          setLastUpdated(format(created, "MMMM d, yyyy"));

          if (diffInDays > 7) {
            // Trigger background refresh (non-blocking)
            fetch("/api/cron/generateMarketInsight");
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

  const preview = insight?.split("\n").slice(0, 4).join("\n");

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
      <SectionTitleBar
        title="📊 Market Trend Prediction"
        tooltip="Insights curated from real-time market signals and macro headlines. Refreshed weekly."
      />

      {loading ? (
        <p className="text-gray-400 mt-2 animate-pulse">Loading latest insight...</p>
      ) : insight ? (
        <>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{preview}</p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 text-blue-600 underline text-sm hover:text-blue-800"
          >
            Read full outlook
          </button>
          {lastUpdated && (
            <p className="mt-2 text-xs text-gray-400">
              Last updated: {lastUpdated}
            </p>
          )}

          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-xl">
                <Dialog.Title className="text-lg font-bold text-gray-800 mb-2">
                  📊 Full Market Insight
                </Dialog.Title>
                <p className="text-gray-700 whitespace-pre-line max-h-[70vh] overflow-y-auto">
                  {insight}
                </p>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      ) : (
        <p className="text-red-500 mt-2">⚠️ No market insight available</p>
      )}
    </div>
  );
}
