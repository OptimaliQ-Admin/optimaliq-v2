import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "Strategy + Support | OptimaliQ - Expert-Backed Growth Execution",
  description: "Get more than insights — get expert-backed execution. Every OptimaliQ plan includes direct strategic support to help you move faster, smarter, and more confidently.",
  openGraph: {
    title: "Strategy + Support | OptimaliQ",
    description: "Get more than insights — get expert-backed execution. Every OptimaliQ plan includes direct strategic support to help you move faster, smarter, and more confidently.",
    url: "https://optimaliq.ai/strategy-support",
    siteName: "OptimaliQ",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OptimaliQ Strategy + Support - Expert-Backed Growth Execution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategy + Support | OptimaliQ",
    description: "Get more than insights — get expert-backed execution. Every OptimaliQ plan includes direct strategic support to help you move faster, smarter, and more confidently.",
    images: ["/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "/strategy-support",
  },
};

export default function StrategySupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Strategy + Support
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Smarter Growth Starts With the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Right Guidance
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <span className="text-blue-600 font-semibold">OptimaliQ</span> gives you more than insights — it gives you expert-backed execution. Every plan includes direct support to help you move faster, smarter, and more confidently.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Strategy Still Matters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI Alone Isn&apos;t Enough —{" "}
              <span className="text-blue-600">Execution Wins the Game</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Our platform delivers powerful insights, but we know data alone doesn&apos;t drive change — people do. That&apos;s why <span className="text-blue-600 font-semibold">OptimaliQ</span> includes hands-on strategic support to help you interpret, prioritize, and act on what matters.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                With over 20 years of experience scaling businesses across industries, our strategy team helps you turn roadmaps into results — not just reports.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What&apos;s Included in Your Plan
            </h2>
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
              <span className="text-2xl">🎯</span>
              Strategic Support Sessions
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-8"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="p-6 text-left font-semibold text-lg">Session</th>
                    <th className="p-6 text-left font-semibold text-lg">Description</th>
                    <th className="p-6 text-center font-semibold text-lg">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-6 font-semibold text-gray-900">Monthly Growth Review (30 min)</td>
                    <td className="p-6 text-gray-600">Quick check-in with a Growth Advisor to align on your dashboard insights, key blockers, and short-term priorities.</td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        1x per month
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-6 font-semibold text-gray-900">Executive Strategy Sessions (60 min)</td>
                    <td className="p-6 text-gray-600">Deep-dive 1:1 coaching sessions with an experienced strategist to address business challenges, growth goals, and high-level execution.</td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        2x per month
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
              <span className="text-2xl">🤝</span>
              These sessions are built into your plan — no extra fees, no upsells.
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Walk Away With */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You&apos;ll Walk Away With
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              "A clear plan of action tailored to your goals",
              "Expert interpretation of your AI-generated insights",
              "Strategic prioritization to avoid wasted effort",
              "Ongoing accountability and performance check-ins",
              "Answers to your toughest growth challenges"
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-6">
                  ✓
                </div>
                <p className="text-gray-700 font-semibold leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* A True Hybrid Approach */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              A True Hybrid Approach
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                <span className="text-blue-600 font-semibold">OptimaliQ</span> blends cutting-edge AI with human strategic thinking. We don&apos;t believe in &quot;set it and forget it&quot; automation. You&apos;ll have access to experts who can help translate the data into decisions — and decisions into results.
              </p>
              <p className="text-2xl font-bold text-gray-900">
                It&apos;s not just a platform. It&apos;s your growth strategy partner.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6">Ready for Real Growth?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                If you&apos;re serious about scale, this is where it starts. Our Strategic Plan includes everything in the Accelerator Plan — plus direct access to senior-level strategic support.
              </p>
              <p className="text-2xl font-bold mb-8">
                Don&apos;t just get a dashboard. Get a direction.
              </p>
              <div className="flex justify-center">
                <Link href="/Pricing">
                  <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Explore the Strategic Plan →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 