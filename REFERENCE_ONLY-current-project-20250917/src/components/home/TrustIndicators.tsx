"use client";

import { motion } from "framer-motion";
import { Grid, Badge, Icon } from "@/components/ui";

export default function TrustIndicators() {
  return (
    <section id="trust-indicators" className="py-16 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600 text-center">Growth-Stage Companies</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-sm text-gray-600 text-center">Scoring Precision</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$2.3M+</div>
              <div className="text-sm text-gray-600 text-center">Revenue Impact</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 text-center">AI Updates</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
