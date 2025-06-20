//src/components/growthstudio/TrendInsightCard.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/dashboard/SectionHeader";

export default function TrendInsightCard() {
  const [insight, setInsight] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch("/api/growth_studio/trends");
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

  const getLeadIn = (text: string) => {
    const lines = text.split("\n");
    const leadInLine = lines.find(line => 
      line.toLowerCase().includes("lead in") || 
      line.toLowerCase().includes("summary") ||
      line.toLowerCase().includes("overview")
    );
    return leadInLine ? leadInLine.replace(/^(lead in|summary|overview):?\s*/i, "").trim() : lines[0];
  };

  const getKeyInsights = (text: string) => {
    const lines = text.split("\n");
    const insights = lines
      .filter(line => line.trim().startsWith("•") || line.trim().startsWith("-"))
      .map(line => line.trim())
      .slice(0, 3); // Get first 3 bullet points
    return insights;
  };

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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🔍 Analyzing Market Trends
            </h3>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              Gathering the latest insights from market signals and industry data to provide you with actionable growth intelligence.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader 
        title="📈 Growth Trends" 
        subtitle="Weekly insights curated from market signals, designed to spark scale-oriented thinking" 
      />

      {insight ? (
        <div className="mt-6 space-y-6">
          {/* Main Insight Summary */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-lg mt-0.5">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Market Insight Summary:</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {getLeadIn(insight)}
                </p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">Key Takeaways:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getKeyInsights(insight).map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {line.replace(/^[•-]\s*/, "").trim()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              <span>Read Full Analysis</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>

            {lastUpdated && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Updated: {lastUpdated}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <div>
              <h4 className="font-semibold text-red-900 text-sm">No Insights Available</h4>
              <p className="text-red-700 text-xs">Trend analysis is currently unavailable. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Analysis Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-4xl w-full bg-white rounded-xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Full Growth Trend Analysis
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {insight && formatModalContent(insight)}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">OptimaliQ.ai</span> • AI-powered market intelligence
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Close Analysis
                </motion.button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
}
