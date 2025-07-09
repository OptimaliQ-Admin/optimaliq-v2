// src/components/growthAssessment/TrustFooter.tsx
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaCheckCircle } from "react-icons/fa";

export default function TrustFooter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="relative w-full bg-white/60 backdrop-blur-sm border-t border-white/20 py-8 mt-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - Security & Privacy */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
              <FaShieldAlt className="text-green-600 text-sm" />
              <span className="text-green-700 text-sm font-semibold">Data Privacy / Security Activated</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
              <FaLock className="text-blue-600 text-sm" />
              <span className="text-blue-700 text-sm font-semibold">256-bit Encryption</span>
            </div>
          </div>

          {/* Right Side - Trust Indicators */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-600 text-sm font-medium">Trusted by industry leaders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 text-sm font-medium">OptimaliQ.ai</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
