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
        <div className="absolute inset-0 bg-gray-400"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-right space-y-6"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Smarter Decisions. Faster Growth. Powered by AI.
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                OptimaliQ: Unlock Predictable Growth with AI-Driven Strategy
              </h2>
              <p className="text-lg text-gray-100 mt-4">
                OptimaliQ delivers instant Instant AI insights + real strategic support when you need it.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
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
                    className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
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
