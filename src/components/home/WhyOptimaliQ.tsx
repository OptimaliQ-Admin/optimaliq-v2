// File: /src/components/home/WhyOptimaliQ.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WhyOptimaliQ() {
  return (
    <section id="why-optimaliq" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Why Choose OptimaliQ
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            The{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              OptimaliQ Advantage
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your competitors are scaling faster by using AI to optimize strategy, streamline execution, and stay ahead of the market. OptimaliQ gives you that same edge — for less than the cost of one hour with a consultant.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-12"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="p-6 text-left font-semibold text-lg">Feature</th>
                  <th className="p-6 text-center font-semibold text-lg">OptimaliQ</th>
                  <th className="p-6 text-center font-semibold text-lg">Traditional Consulting</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cost", "Starts at $249/mo", "$10,000+ Retainers"],
                  ["Speed", "Instant, AI-Powered Insights", "Weeks of Manual Reporting"],
                  ["Actionability", "Real-Time Strategy Adjustments", "Static Reports & Decks"],
                  ["Market Awareness", "Live Trend + Benchmark Data", "Limited to Analyst Opinion"],
                  ["Scalability", "Continuously Learns & Improves", "Bound by Human Bandwidth"],
                  ["Execution", "AI Task Recommendations & Playbooks", "Requires Internal Teams"],
                ].map(([label, optimaliq, consulting], i) => (
                  <motion.tr
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="p-6 font-semibold text-gray-900">{label}</td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {optimaliq}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {consulting}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6">
              💰
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Effective</h3>
            <p className="text-gray-600">
              Get enterprise-level strategic insights at a fraction of traditional consulting costs.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600">
              Instant insights and recommendations, not weeks of waiting for reports.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6">
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Always Relevant</h3>
            <p className="text-gray-600">
              Continuously updated insights that adapt to market changes and your business evolution.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business Strategy?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that have accelerated their growth with AI-powered strategic intelligence.
            </p>
            <div className="flex justify-center">
              <Link href="/growth-assessment">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Unlock My Growth Plan
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
