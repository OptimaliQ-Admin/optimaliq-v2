//src/app/premium/onboarding/initial-assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "@/components/shared/ProgressBar";
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
import { 
  ArrowLeftIcon, 
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

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
  }, [user?.u_id, isUserLoaded, router]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Preparing your personalized assessment...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <RocketLaunchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OptimaliQ Assessment</h1>
                <p className="text-sm text-gray-600">Personalized Growth Analysis</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Powered by AI</p>
              <p className="text-xs text-gray-400">Secure & Confidential</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProgressBar current={step} total={8} />
        
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Content Area */}
          <div className="p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <StepGroupRenderer step={step} answers={formAnswers} onAnswer={handleAnswer} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Navigation */}
          <div className="px-8 lg:px-12 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              {/* Back Button */}
              <motion.button
                disabled={step === 0}
                onClick={handleBack}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  step === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                }`}
                whileHover={step > 0 ? { scale: 1.02 } : {}}
                whileTap={step > 0 ? { scale: 0.98 } : {}}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back
              </motion.button>

              {/* Progress Indicator */}
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Step {step + 1} of 8</span>
                </div>
                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 8) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Next/Submit Button */}
              <motion.button
                onClick={handleNext}
                disabled={submitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  submitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : step === 7
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                }`}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : step === 7 ? (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Analyze Assessment</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>5-Minute Completion</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}