//src/components/home/FaqSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "How does OptimaliQ compare to hiring a consultant?",
    answer:
      "OptimaliQ delivers continuous, AI-powered insights instantly, while consulting firms charge high retainers for one-time reports. Our platform provides real-time strategy optimization, competitive benchmarking, and predictive insights at a fraction of the cost.",
  },
  {
    question: "Can this work for small businesses?",
    answer:
      "Absolutely! Whether you're a startup or enterprise, OptimaliQ adapts to your needs with AI-driven insights that scale as you grow. Our platform is designed to provide value for businesses of all sizes.",
  },
  {
    question: "How does OptimaliQ predict growth?",
    answer:
      "We analyze real-time industry data, past performance, and competitive benchmarks using advanced machine learning algorithms to provide accurate business forecasts and strategic recommendations.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. OptimaliQ uses industry best practices to ensure your business data is protected. We follow strict data privacy protocols, implement enterprise-grade encryption, and never share your information with third parties. Your trust is our priority, and we continuously monitor and improve our security posture.",
  },
  {
    question: "How often does OptimaliQ update insights?",
    answer:
      "Our AI continuously learns and updates insights in real-time, ensuring you always have the latest competitive intelligence and market trends to inform your strategic decisions.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We provide comprehensive support including onboarding, strategic consultation, and ongoing optimization. Our team of experts is available to help you maximize the value of your OptimaliQ investment.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
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
            FAQ
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about OptimaliQ&apos;s AI-powered strategic intelligence platform.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map(({ question, answer }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div 
                className={`bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 pr-4">
                    {question}
                  </h3>
                  <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="h-px bg-gradient-to-r from-blue-500 to-indigo-500 mb-4"></div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
