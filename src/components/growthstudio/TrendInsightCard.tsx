//src/components/growthstudio/TrendInsightCard.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

export default function TrendInsightCard() {
  const [insight, setInsight] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch("/api/tier2/growth_studio/trends");
        const data = await res.json();

        if (data?.insight && data?.createdat) {
          setInsight(data.insight);
          setLastUpdated(format(new Date(data.createdat), "MMMM d, yyyy"));
        }
      } catch (error) {
        console.error("Error fetching trend insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  const getLeadIn = (text: string) =>
    text.split("\n").find((line) => line.toLowerCase().includes("lead in")) ||
    "Lead-in not found";

  const getTopBullets = (text: string) =>
    text
      .split("\n")
      .filter((line) => line.startsWith("•"))
      .slice(0, 2)
      .join("\n");

  const formatModalContent = (text: string) => {
    const [main, tail] = text.split("Final thoughts");

    return (
      <>
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line space-y-4 max-h-[70vh] overflow-y-auto">
          {main
            .replace("Lead in Statement", "🔥 Business Trend Summary:")
            .replace(/\[Headline.*?\]/g, (match) => `🎯 ${match.replace(/[\[\]]/g, "")}`)
            .split("\n")
            .map((line, idx) => (
              <p
                key={idx}
                className={
                  line.startsWith("•")
                    ? "ml-4 before:content-['•_']"
                    : line.startsWith("🎯")
                    ? "font-semibold mt-4"
                    : ""
                }
              >
                {line}
              </p>
            ))}
        </div>

        {tail && (
          <div className="mt-6 italic text-sm text-gray-600 border-t pt-4">
            {tail.trim()}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
      <SectionTitleBar
        title="📈 Growth Trends"
        tooltip="Weekly insights curated from market signals, designed to spark scale-oriented thinking."
      />

      {loading ? (
        <p className="text-gray-400 mt-2 animate-pulse">Loading insights...</p>
      ) : insight ? (
        <>
          <p className="text-gray-700 font-semibold mb-1">{getLeadIn(insight)}</p>
          <p className="text-gray-600 whitespace-pre-line text-sm">{getTopBullets(insight)}</p>

          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 text-blue-600 underline text-sm hover:text-blue-800"
          >
            🔍 Read full insight
          </button>
          {lastUpdated && (
            <p className="mt-2 text-xs text-gray-400">Last updated: {lastUpdated}</p>
          )}

          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-xl">
                <Dialog.Title className="text-lg font-bold text-red-600 mb-4">
                  🔥 This Week's Feed
                </Dialog.Title>

                {insight && formatModalContent(insight)}

                <div className="mt-6 text-right">
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
        <p className="text-red-500 mt-2">⚠️ No insights available</p>
      )}
    </div>
  );
}
