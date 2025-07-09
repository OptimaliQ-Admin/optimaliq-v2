"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import SectionTitleBar from "./SectionTitleBar";

export default function BusinessTrendCard() {
  const [trend, setTrend] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await fetch("/api/dashboard/business_trends");
        const data = await res.json();

        if (data?.insight && data?.createdat) {
          setTrend(data.insight);
          setLastUpdated(format(new Date(data.createdat), "MMMM d, yyyy"));
        }
      } catch (error) {
        console.error("Error fetching business trend insight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  const preview = trend?.split("\n").slice(0, 4).join("\n");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full"
    >
      <SectionTitleBar
        title="🔥 Business Trend Predictions"
        tooltip="Strategic market guidance pulled from real-time data and headlines. Updated weekly."
      />

      {loading ? (
        <div className="mt-6 space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : trend ? (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {preview}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              <span>Read full outlook</span>
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
            <span className="text-red-700 text-sm font-medium">No business trend available</span>
          </div>
        </div>
      )}

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Real-time insights
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-3xl w-full bg-white rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  Business Trend Predictions
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
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {trend}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {lastUpdated && `Last updated: ${lastUpdated}`}
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