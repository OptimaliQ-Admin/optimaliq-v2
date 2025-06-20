"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PricingToggle from "../../components/pricing/PricingToggle";
import PricingGrid from "../../components/pricing/PricingGrid";
import ComparisonBlock from "../../components/pricing/ComparisonBlock";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  return (
    <div className="min-h-screen bg-white">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Pricing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <PricingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        </motion.div>

        {/* Pricing Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <PricingGrid billingCycle={billingCycle} />
        </motion.div>

        {/* Comparison Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ComparisonBlock />
        </motion.div>
      </div>
    </div>
  );
}
