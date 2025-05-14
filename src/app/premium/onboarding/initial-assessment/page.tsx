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
      alert("User not authenticated. Please log in again.");
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
      alert("Please complete all required questions before continuing.");
      return;
    }
  
    if (!user?.u_id) {
      alert("User session expired. Please log in again.");
      router.push("/subscribe/create-account");
      return;
    }
  
    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }
  
    try {
      const sanitized = stripOtherFields(formAnswers);
      const response = await fetch("/api/premium/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: user.u_id, formAnswers: sanitized }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        alert(`Submission error: ${result.error}`);
        return;
      }
  
      router.push("/premium/dashboard");
    } catch (err: unknown) {
      alert("Unexpected error occurred: " + getErrorMessage(err));
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
        <ProgressBar current={step} total={7} />
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
              {submitting ? "Submitting..." : step === 6 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}