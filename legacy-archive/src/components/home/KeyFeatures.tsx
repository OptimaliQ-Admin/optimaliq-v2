//src/components/home/KeyFeatures.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📊",
    title: "AI-Powered Business Assessments",
    description:
      "Instantly analyze your business health, identify strategy gaps, and uncover optimization potential.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    icon: "⚡",
    title: "Real-Time Strategy Optimization",
    description:
      "Adapt dynamically with AI-driven insights, adjusting your business strategy as new data emerges.",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
  {
    icon: "📈",
    title: "Competitive Benchmarking",
    description:
      "Compare your performance with industry leaders and uncover actionable areas for growth.",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
  },
  {
    icon: "🔮",
    title: "Predictive Growth Insights",
    description:
      "Forecast market shifts and make proactive, data-driven decisions before your competition.",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
  },
];

export default function KeyFeatures() {
  return (
    <section id="key-features" className="py-24 bg-white relative overflow-hidden">
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
            Key Features
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Enterprise-Grade{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Strategic Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The essential tools designed to accelerate growth, optimize strategy, and maximize efficiency across your entire organization.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map(({ icon, title, description, color, bgColor }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 h-full">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${color} text-white flex items-center justify-center rounded-2xl text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {description}
                  </p>
                  
                  {/* Bottom Accent */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${color} rounded-full w-0 group-hover:w-full transition-all duration-500`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-gray-200 mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Built to Analyze Growth-Stage Companies</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-sm text-gray-600">Engineered for Scoring Precision</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">$2.3M+</div>
              <div className="text-sm text-gray-600">Designed for Revenue Impact Potential</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">AI-Driven Strategy Updates</div>
            </div>
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
            <h3 className="text-3xl font-bold mb-4">Ready to Unlock Your Growth Potential?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get your comprehensive growth report and personalized strategic recommendations in minutes.
            </p>
            <div className="flex justify-center">
              <Link href="/growth-assessment">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Your Free Growth Report
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
