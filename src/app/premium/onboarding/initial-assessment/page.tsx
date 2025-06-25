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

export default function InitialAssessmentPage() {
  const router = useRouter();
  const { user, isUserLoaded } = usePremiumUser(); // ✅ Get isUserLoaded

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

  // Add keyboard event listener for testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("🔍 Key pressed:", e.key, "Code:", e.code);
      if (e.key === " ") {
        console.log("🔍 Spacebar pressed!");
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, []);

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
      const sanitized = stripOtherFields(formAnswers);
      
      // Store the assessment data in localStorage
      localStorage.setItem("onboarding_assessment_data", JSON.stringify(sanitized));
      
      // Redirect to analyzing page
      router.push("/premium/onboarding/analyzing");
      
    } catch (err: unknown) {
      showToast.error("Unexpected error occurred: " + getErrorMessage(err));
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

  if (loading) return <div className="p-10 text-center">Preparing your onboarding...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={step} total={8} />
        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
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

          <div className="mt-6 flex justify-between">
            <button
              disabled={step === 0}
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Processing..." : step === 7 ? "Analyze Assessment" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}