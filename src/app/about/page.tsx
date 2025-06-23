"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About OptimaliQ
            </h1>
            <p className="text-2xl font-semibold text-blue-600 mb-8">
              Smarter decisions. Faster growth. Real-time insights.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              OptimaliQ is an AI-powered growth strategy platform built to help forward-thinking companies unlock their full potential. We transform raw assessment data into strategic clarity—benchmarking your performance, identifying operational gaps, and delivering personalized roadmaps for growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why We Exist
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Most businesses rely on spreadsheets, gut checks, and generic advice to make critical decisions. We believe in a smarter way—where leaders can access McKinsey-style strategic insights in minutes, not months, without needing a six-figure consulting engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What We Do
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              OptimaliQ blends intelligent assessments, AI models, and real-time benchmarks to help organizations:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Diagnose Performance
              </h3>
              <p className="text-gray-700">
                Comprehensive analysis across strategy, process, and technology to identify strengths and opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Benchmark Against Peers
              </h3>
              <p className="text-gray-700">
                Compare your performance against industry peers and top performers to understand your competitive position.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Actionable Growth Plans
              </h3>
              <p className="text-gray-700">
                Receive personalized 30-day and 90-day growth plans with specific, actionable recommendations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Track Progress
              </h3>
              <p className="text-gray-700">
                Monitor your growth journey and evolve strategies with each monthly assessment.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're a startup scaling operations or an established firm seeking a competitive edge, OptimaliQ gives you the clarity and confidence to move forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Who We Serve
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              OptimaliQ is used by:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-4">
                <div className="text-3xl mb-3">👔</div>
                <h3 className="text-xl font-semibold mb-2">Founders & CEOs</h3>
                <p className="text-blue-100">
                  Looking to scale with precision and data-driven insights
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-4">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-semibold mb-2">Revenue & Operations Leaders</h3>
                <p className="text-blue-100">
                  Seeking clarity across teams and processes
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-4">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Consultants & Partners</h3>
                <p className="text-blue-100">
                  Looking to add strategic value to their clients
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-4">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="text-xl font-semibold mb-2">Nonprofit & Public Sector</h3>
                <p className="text-blue-100">
                  Driving transformation with limited resources
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl shadow-2xl">
              <p className="text-2xl font-semibold leading-relaxed">
                To make strategic clarity accessible—powered by AI, grounded in data, and designed for action.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 