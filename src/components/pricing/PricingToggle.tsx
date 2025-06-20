"use client";

import { motion } from "framer-motion";

interface PricingToggleProps {
  billingCycle: "annual" | "monthly";
  setBillingCycle: (cycle: "annual" | "monthly") => void;
}

export default function PricingToggle({ billingCycle, setBillingCycle }: PricingToggleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 inline-flex">
        <button
          className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
            billingCycle === "annual" 
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setBillingCycle("annual")}
        >
          Annual
          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Save 20%
          </span>
        </button>
        <button
          className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
            billingCycle === "monthly" 
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
      </div>
    </motion.div>
  );
}
