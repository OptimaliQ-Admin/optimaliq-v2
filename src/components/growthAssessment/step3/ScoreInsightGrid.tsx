// components/step3/ScoreInsightGrid.tsx
"use client";

import { motion } from "framer-motion";
import { 
  LightBulbIcon,
  CogIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

export default function ScoreInsightGrid({ insights, loading }: { insights: Record<string, string>, loading: boolean }) {
  const insightConfig = {
    strategy: {
      icon: LightBulbIcon,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    process: {
      icon: CogIcon,
      color: "emerald",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    },
    technology: {
      icon: ComputerDesktopIcon,
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 h-full"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
          <ChartBarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Strategic Insights</h3>
          <p className="text-sm text-gray-500">AI-powered recommendations for growth optimization</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-600 font-medium">Generating insights...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(insights).map(([key, value], index) => {
            const config = insightConfig[key as keyof typeof insightConfig];
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-gradient-to-r ${config.bgGradient} rounded-xl p-6 border ${config.borderColor} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 capitalize">
                        {key} Optimization
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {value}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <SparklesIcon className="w-3 h-3 text-blue-500" />
                          <span>AI-generated recommendation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mt-8 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-bold">Unlock Advanced Analytics</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Get unlimited access to detailed analysis, personalized roadmaps, and real-time benchmarking with OptimaliQ Pro.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                Weekly insights
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                Industry benchmarks
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                AI recommendations
              </span>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Strategic Clarity</h4>
                <p className="text-gray-700 text-sm">
                  Transform complex business challenges into clear, actionable growth strategies with AI-powered insights.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Proven Results</h4>
                <p className="text-gray-700 text-sm">
                  Join 2,000+ businesses achieving 3x faster growth and 40% efficiency improvements with OptimaliQ.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
