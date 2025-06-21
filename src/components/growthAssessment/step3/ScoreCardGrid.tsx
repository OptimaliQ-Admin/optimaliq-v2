// components/step3/ScoreCardGrid.tsx
"use client";

import { useState } from "react";
import GMFModal from "./GMFModal";
import SocialProofCard from "./SocialProofCard";
import { motion } from "framer-motion";

export default function ScoreCardGrid({ score }: { score: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* GMF+ Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">GMF+ Score</h3>
              <p className="text-sm text-gray-500">Growth Maturity Framework</p>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-blue-600 mb-1">{score} out of 5</div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Your current growth maturity level based on strategy, process, and technology optimization.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
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
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Industry Benchmark</h3>
              <p className="text-sm text-gray-500">Top performers average</p>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-green-600 mb-1">4.2 out of 5</div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Average score of top industry performers. Unlock detailed benchmarking with OptimaliQ Pro.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-xs font-medium">
              💡 Pro tip: Top performers focus on data-driven decision making and continuous optimization
            </p>
          </div>
        </div>
      </motion.div>

      {/* Optimization Potential Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Optimization Potential</h3>
              <p className="text-sm text-gray-500">Growth opportunity</p>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-purple-600 mb-1">+{(5 - score - 0.5).toFixed(1)} out of 5</div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Potential to elevate your score and revenue over the next 12 months with strategic improvements.
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-purple-800 text-xs font-medium">
              🚀 Unlock predictive modeling and personalized roadmaps with OptimaliQ Pro
            </p>
          </div>
        </div>
      </motion.div>

      {/* Social Proof Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SocialProofCard />
      </motion.div>

      <GMFModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
