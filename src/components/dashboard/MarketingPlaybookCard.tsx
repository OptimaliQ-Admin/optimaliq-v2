// File: /src/components/dashboard/MarketingPlaybookCard.tsx

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import SectionTitleBar from "./SectionTitleBar";

export default function MarketingPlaybookCard() {
  const [insight, setInsight] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [playbookData, setPlaybookData] = useState<any>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch("/api/dashboard/marketing_playbook");
        const data = await res.json();

        if (data?.insight && data?.createdat) {
          setInsight(data.insight);
          setLastUpdated(format(new Date(data.createdat), "MMMM d, yyyy"));
          
          // Store additional data for modal
          setPlaybookData({
            insight: data.insight,
            createdat: data.createdat,
            source: data.source,
            title: data.title,
            signalStrength: data.signalStrength,
            confidenceScore: data.confidenceScore,
            nextRefresh: data.nextRefresh,
            dataSources: data.dataSources,
            sourceUrls: data.sourceUrls,
            trendCount: data.trendCount
          });
        }
      } catch (error) {
        console.error("Error fetching marketing playbook insight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  const formattedMonthYear = lastUpdated
  ? new Date(lastUpdated).toLocaleString("default", { month: "long", year: "numeric" })
  : "{Month Year}";

  const fullInsight = insight?.replace("{Month Year}", formattedMonthYear);

  // Extract meaningful preview content from the new format
  const getPreview = (content: string) => {
    if (!content) return "";
    
    const lines = content.split("\n");
    const trendsIndex = lines.findIndex(line => line.includes("🔥 Trends:"));
    
    if (trendsIndex !== -1) {
      // Get the headline and first few lines of trends
      const headlineSection = lines.slice(0, trendsIndex + 1); // Include the trends header
      const trendsContent = lines.slice(trendsIndex + 1);
      
      // Get first few lines of trends (up to 3 lines)
      const firstTrendLines = trendsContent.slice(0, 3);
      
      return [...headlineSection, ...firstTrendLines].join("\n");
    }
    
    // Fallback to first 6 lines if format is different
    return lines.slice(0, 6).join("\n");
  };

  const preview = getPreview(fullInsight || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full"
    >
      <SectionTitleBar
        title="📢 Marketing Intelligence Brief"
        tooltip="Insights from the most trusted marketing publications—analyzed and refreshed biweekly."
      />

      {loading ? (
        <div className="mt-6 space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : insight ? (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {preview}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              <span>Read full playbook</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {lastUpdated && (
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                Updated {lastUpdated}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 text-sm font-medium">No marketing playbook available</span>
          </div>
        </div>
      )}

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Marketing intelligence
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-4xl w-full bg-white rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">📢</span>
                  Marketing Intelligence Brief
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

              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Marketing Intelligence Report</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {playbookData?.signalStrength || 'Strong'} Signal
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {Math.round((playbookData?.confidenceScore || 0.82) * 100)}% Confidence
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium">{lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Refresh</p>
                    <p className="font-medium">{playbookData?.nextRefresh ? new Date(playbookData.nextRefresh).toLocaleDateString() : 'Monday 12am'}</p>
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HubSpot</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AdWeek</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Marketing Dive</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Social Media Examiner</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Content Marketing Institute</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>LinkedIn</span>
                  </div>
                </div>
              </div>

              {/* Source URLs */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-100">
                <h4 className="font-medium text-gray-900 mb-3">Key Sources</h4>
                <div className="space-y-2 text-sm">
                  <a href="https://www.hubspot.com/hubfs/2025%20State%20of%20Marketing%20from%20HubSpot.pdf" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-800 block">
                    📄 2025 State of Marketing Report (HubSpot)
                  </a>
                  <a href="https://www.adweek.com/category/marketing/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-800 block">
                    📰 AdWeek Marketing News
                  </a>
                  <a href="https://www.marketingdive.com/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-800 block">
                    📊 Marketing Dive Insights
                  </a>
                </div>
              </div>
              
              {/* Main Insight */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-[50vh] overflow-y-auto mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Marketing Analysis</h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {fullInsight}
                </p>
              </div>

              {/* Refresh Schedule */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Refresh Schedule</h4>
                <p className="text-sm text-gray-700">
                  This data refreshes automatically every Monday at 12am. Manual refresh is available once per day.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Powered by OptimaliQ.ai • AI-powered marketing intelligence
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
}
