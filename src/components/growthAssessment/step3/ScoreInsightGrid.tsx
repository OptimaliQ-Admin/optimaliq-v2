// components/step3/ScoreInsightGrid.tsx
"use client";

import { motion } from "framer-motion";

export default function ScoreInsightGrid({ insights, loading }: { insights: Record<string, string>, loading: boolean }) {
  const insightIcons = {
    strategy: "🎯",
    process: "⚙️",
    technology: "💻"
  };

  const insightColors = {
    strategy: "from-blue-500 to-indigo-600",
    process: "from-green-500 to-emerald-600", 
    technology: "from-purple-500 to-pink-600"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">📌</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Data-Driven Business Insights</h3>
          <p className="text-sm text-gray-500">AI-powered recommendations for your growth strategy</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Generating insights...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(insights).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-gray-300">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${insightColors[key as keyof typeof insightColors]} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                    <span className="text-lg">{insightIcons[key as keyof typeof insightIcons]}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 capitalize">
                      {key} Insight
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {value}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>AI-generated recommendation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mt-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Ready for More Insights?</h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Get unlimited access to detailed analysis, personalized roadmaps, and real-time benchmarking with OptimaliQ Pro.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Weekly insights
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Industry benchmarks
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI recommendations
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
