// src/components/growthAssessment/FormHeader.tsx
import { motion } from "framer-motion";
import { FaChartLine, FaLightbulb, FaRocket } from "react-icons/fa";

export default function FormHeader() {
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
        <FaChartLine className="text-sm" />
        <span>AI-Powered Growth Analysis</span>
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
          Scalable Growth
        </span>{" "}
        Backed by Data
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-xl text-gray-600 leading-relaxed max-w-2xl"
      >
        Make <strong className="text-gray-900">confident decisions</strong> backed by{" "}
        <strong className="text-gray-900">data-driven insights</strong>. Our analysis{" "}
        <strong className="text-gray-900">pinpoints hidden opportunities</strong> to refine strategy, 
        boost efficiency, and scale — <strong className="text-gray-900">fast</strong>.
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
            <FaLightbulb className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Strategic Insights</h3>
          <p className="text-sm text-gray-600">Discover hidden growth opportunities with AI-powered analysis</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <FaChartLine className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Data-Driven</h3>
          <p className="text-sm text-gray-600">Benchmark against industry leaders and track your progress</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
            <FaRocket className="text-white text-xl" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Actionable Plans</h3>
          <p className="text-sm text-gray-600">Get personalized roadmaps to accelerate your growth</p>
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
          <span className="text-sm text-gray-600">2-minute assessment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Instant insights</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">100% free</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
