//src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[70vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Hero_Background.jpeg"
          alt="OptimaliQ Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-400/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl text-center space-y-8 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Smarter Decisions. Faster Growth. Powered by AI.
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700 leading-relaxed">
                <span className="text-blue-600 font-bold">OptimaliQ</span>: Unlock Predictable Growth with AI-Driven Strategy
              </h2>
              <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed">
                OptimaliQ delivers instant Instant AI insights + real strategic support when you need it.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/growth-assessment"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <span>Start Your Free Growth Audit</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/#how-it-works"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
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
        </div>
      </div>
    </section>
  );
}
