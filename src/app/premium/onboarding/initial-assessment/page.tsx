//src/app/premium/onboarding/initial-assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import EnhancedProgressBar from "@/components/shared/EnhancedProgressBar";
import StepGroupRenderer from "@/components/shared/StepGroupRenderer";
import { stepValidators } from "@/utils/initialAssessmentValidators";
import {
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import { stripOtherFields } from "@/utils/stripOtherFields";
import { getErrorMessage } from "@/utils/errorHandler";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { showToast } from "@/lib/utils/toast";
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

const STEP_NAMES = [
  "Goals & Metrics",
  "Positioning",
  "Operations",
  "Growth Stack",
  "Clarity",
  "Benchmarks",
  "Business Overview",
  "Final"
];

export default function InitialAssessmentPage() {
  const router = useRouter();
  const { user, isUserLoaded } = usePremiumUser();

  const [step, setStep] = useState(0);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoaded) return;
  
    console.log("🧠 isUserLoaded =", isUserLoaded);
    console.log("🧠 user =", user);
  
    if (!user?.u_id) {
      showToast.error("User not authenticated. Please log in again.");
      router.push("/subscribe/create-account");
    } else {
      setLoading(false);
    }
  }, [user, isUserLoaded, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    const validator = stepValidators[step];
    if (validator && !validator(formAnswers)) {
      showToast.warning("Please complete all required questions before continuing.");
      return;
    }
  
    if (!user?.u_id) {
      showToast.error("User session expired. Please log in again.");
      router.push("/subscribe/create-account");
      return;
    }
  
    if (step < 7) {
      setStep((prev) => prev + 1);
      return;
    }
  
    // Final step - store data and redirect to analyzing page
    try {
      setSubmitting(true);
      const sanitized = stripOtherFields(formAnswers);
      
      // Store the assessment data in localStorage
      localStorage.setItem("onboarding_assessment_data", JSON.stringify(sanitized));
      
      // Redirect to analyzing page
      router.push("/premium/onboarding/analyzing");
      
    } catch (err: unknown) {
      showToast.error("Unexpected error occurred: " + getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };  

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleAnswer = (key: string, value: AssessmentAnswerValue) => {
    setFormAnswers((prev) => {
      const updated = { ...prev, [key]: value };

      if (key.endsWith("_other")) {
        const baseKey = key.replace("_other", "");
        const baseValue = prev[baseKey] || [];
      
        const cleaned = Array.isArray(baseValue)
          ? baseValue.filter((item: string) => !item.startsWith("Other:"))
          : [];
      
        if (typeof value === "string" && value.trim()) {
          cleaned.push(`Other: ${value.trim()}`);
        }
      
        updated[baseKey] = cleaned;
      }

      if (Array.isArray(value) && key && !value.includes("other")) {
        updated[`${key}_other`] = "";
        updated[key] = value.filter((item: string) => !item.startsWith("Other:"));
      }

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Preparing your onboarding...
          </h2>
          <p className="text-gray-600">Setting up your personalized experience</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Let&apos;s Build Your Growth Strategy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;ll analyze your business and create a personalized growth roadmap
          </p>
        </motion.div>

        {/* Progress Bar */}
        <EnhancedProgressBar 
          current={step} 
          total={8} 
          steps={STEP_NAMES}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Step Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <StepGroupRenderer step={step} answers={formAnswers} onAnswer={handleAnswer} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-8 md:px-12 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={step === 0}
                onClick={handleBack}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  step === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : step === 7 ? (
                  <>
                    Analyze Assessment
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Your data is secure and will only be used to personalize your experience
          </p>
        </motion.div>
      </div>
    </div>
  );
}