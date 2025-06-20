import { motion } from "framer-motion";
import { FaRocket, FaChartLine, FaCrown } from "react-icons/fa";

export default function SubscribeHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative text-left flex flex-col justify-center h-full space-y-8"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit"
      >
        <FaRocket className="text-sm" />
        <span>Premium Strategic Intelligence</span>
      </motion.div>

      {/* Main Heading */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
      >
        Unlock{" "}
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Premium Insights
        </span>{" "}
        & Strategic Growth
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-xl text-gray-600 leading-relaxed max-w-2xl"
      >
        Get <strong className="text-gray-900">unlimited access</strong> to AI-powered strategic insights,{" "}
        <strong className="text-gray-900">real-time market intelligence</strong>, and{" "}
        <strong className="text-gray-900">personalized growth roadmaps</strong> that scale with your business.
      </motion.p>

      {/* Feature Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FaChartLine className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
          <p className="text-sm text-gray-600">Deep-dive insights with competitive benchmarking and trend analysis</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <FaRocket className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Growth Studio</h3>
          <p className="text-sm text-gray-600">Interactive simulations and strategic planning tools</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
            <FaCrown className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Premium Support</h3>
          <p className="text-sm text-gray-600">Priority access to strategic consultation and expert guidance</p>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex items-center gap-8 pt-8 border-t border-gray-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Cancel anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Instant access</span>
        </div>
      </motion.div>
    </motion.div>
  );
} 