//src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="text-center py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl font-bold text-gray-800">
            Unlock Predictable Growth with AI-Driven Strategy
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Get instant AI-powered insights, track your business progress, and take action with a personalized 30-day plan—every month.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/growth-assessment"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              >
                <span>Start Your Free Growth Audit</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              >
                <span>Learn More</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
