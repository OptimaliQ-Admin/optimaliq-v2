// components/step3/ScoreCardGrid.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";
import GMFModal from "./GMFModal";

export default function ScoreCardGrid({ score }: { score: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getScoreColor = (value: number) => {
    if (value >= 4.0) return "emerald";
    if (value >= 3.0) return "blue";
    if (value >= 2.0) return "amber";
    return "red";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 4.0) return "Mature";
    if (value >= 3.0) return "Developing";
    if (value >= 2.0) return "Emerging";
    return "Foundation";
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <>
      {/* GMF+ Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">GMF+ Score</h3>
            <p className="text-sm text-gray-500">Growth Maturity Framework</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-blue-600">{score.toFixed(1)}</span>
            <span className="text-lg text-gray-500">/ 5.0</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-${scoreColor}-100 text-${scoreColor}-700`}>
            <div className={`w-2 h-2 rounded-full bg-${scoreColor}-500`}></div>
            {scoreLabel}
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Your current growth maturity level based on strategy, process, and technology optimization.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <SparklesIcon className="w-3 h-3 text-blue-500" />
            Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span>
          </div>
          
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center gap-1 group-hover:gap-2"
          >
            Learn more about GMF+ →
          </motion.button>
        </div>
      </motion.div>

      {/* Industry Benchmark Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Industry Benchmark</h3>
            <p className="text-sm text-gray-500">Top performers average</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-emerald-600">4.2</span>
            <span className="text-lg text-gray-500">/ 5.0</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
            <StarIcon className="w-3 h-3" />
            Top Tier
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Average score of top industry performers. Unlock detailed benchmarking with OptimaliQ Pro.
          </p>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <LightBulbIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-emerald-800 text-sm font-medium mb-1">Pro tip</p>
                <p className="text-emerald-700 text-xs">
                  Top performers focus on data-driven decision making and continuous optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Optimization Potential Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Optimization Potential</h3>
            <p className="text-sm text-gray-500">Growth opportunity</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold text-purple-600">+{(5 - score).toFixed(1)}</span>
            <span className="text-lg text-gray-500">points</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
            <ArrowTrendingUpIcon className="w-3 h-3" />
            20% potential
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Potential to elevate your score and revenue over the next 12 months with strategic improvements.
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-800 text-sm font-medium mb-1">Unlock advanced features</p>
                <p className="text-purple-700 text-xs">
                  Get predictive modeling and personalized roadmaps with OptimaliQ Pro
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Proof Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Trusted by Leaders</h3>
            <p className="text-sm text-gray-300">Join 2,000+ businesses</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <span>+1,995 more</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Average 3x faster growth</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">40% efficiency improvements</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Real-time benchmarking</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              &ldquo;OptimaliQ transformed our growth strategy from guesswork to data-driven decisions.&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-1">— Sarah Chen, CEO at TechFlow</p>
          </div>
        </div>
      </motion.div>

      <GMFModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
