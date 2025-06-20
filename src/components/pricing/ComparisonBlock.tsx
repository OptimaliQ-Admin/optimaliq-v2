import { motion } from "framer-motion";

export default function ComparisonBlock() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border border-white/20"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Why <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">OptimaliQ</span> Wins — Every Time
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered. Always on. Built for real business momentum.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* OptimaliQ */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">OptimaliQ</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Smarter than hiring a consultant — and costs less than one hour of their time",
              "Instant Strategy with Zero Ramp-Up",
              "Real-Time Market & Trend Intelligence (Updated Weekly)",
              "Monthly Progress Reviews with Actionable Adjustments",
              "Benchmarking vs. Industry & Top Performers"
            ].map((item, index) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 text-gray-700"
              >
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Traditional Consulting */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border border-red-100 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⏰</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Traditional Consulting</h3>
          </div>
          <ul className="space-y-4">
            {[
              "$10,000+ Retainers",
              "Slow, Manual Reporting",
              "Recommendations Stale by the Time You Get Them",
              "Limited to Human Bandwidth",
              "Static Strategy Without Data Refresh"
            ].map((item, index) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
}
