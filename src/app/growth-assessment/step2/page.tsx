// src/app/growth-assessment/step2/page.tsx
"use client";

import { motion } from "framer-motion";
import GrowthAssessmentChat from "@/components/growthAssessment/GrowthAssessmentChat";
import { FaChartLine, FaShieldAlt, FaLightbulb } from "react-icons/fa";

export default function GrowthAssessmentStep2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-0"
      >
        {/* Keep the existing header look/feel, but embed chat underneath */}
        <div className="px-8 pt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaChartLine className="text-sm" />
              <span>Step 2 of 2 – Business Profile</span>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Growth Roadmap</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
              Answer a few quick questions to receive custom insights on how to scale your business effectively.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                <span>AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-8">
          <GrowthAssessmentChat />
        </div>
      </motion.div>
    </div>
  );
}
