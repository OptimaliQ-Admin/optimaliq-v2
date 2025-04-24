// src/app/growth-assessment/page.tsx
"use client";

import FormHeader from "../../components/growthAssessment/FormHeader";
import GrowthAssessmentForm from "../../components/growthAssessment/GrowthAssessmentForm";
import TrustFooter from "../../components/growthAssessment/TrustFooter";

export default function GrowthAssessmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative">
        <FormHeader />
        <GrowthAssessmentForm />
      </div>

      {/* ✅ Proper Footer Placement */}
      <TrustFooter />
    </div>
  );
}
