// src/app/growth-assessment/page.tsx
"use client";

import { motion } from "framer-motion";
import FormHeader from "../../components/growthAssessment/FormHeader";
import GrowthAssessmentForm from "../../components/growthAssessment/GrowthAssessmentForm";
import TrustFooter from "../../components/growthAssessment/TrustFooter";

export default function GrowthAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          <FormHeader />
          <GrowthAssessmentForm />
        </motion.div>
      </div>

      {/* Enhanced Trust Footer */}
      <TrustFooter />
    </div>
  );
}
