//src/app/premium/assessment/sales_performance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "@/components/shared/ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";
import { usePremiumUser } from "@/context/PremiumUserContext";
import {
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import { getErrorMessage } from "@/utils/errorHandler";
import { isDynamicStepValid } from "@/lib/validation/isDynamicStepValid";

export default function SalesPerformanceAssessmentPage() {
  const router = useRouter();
  const { user } = usePremiumUser();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});

  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

  const stripUnusedOtherFields = (answers: AssessmentAnswers) => {
    const result: AssessmentAnswers = {};
    for (const key in answers) {
      if (key.endsWith("_other")) continue;
      result[key] = answers[key];
    }
    return result;
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (skipCheck) {
        setLoading(false);
        return;
      }

      if (!user?.email) {
        router.push("/pricing");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("tier2_users")
          .select("subscription_status")
          .eq("email", user.email)
          .single();

        if (error || !data || data.subscription_status !== "active") {
          console.warn("🚫 Access denied: not an active tier2 user");
          setError("Access Denied. Please subscribe first.");
          router.push("/pricing");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Error checking subscription:", err);
        setError("Something went wrong. Try again later.");
      }
    };

    checkSubscription();
  }, [router, user?.email, skipCheck]);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user?.u_id && !skipCheck) return;

      try {
        const { data, error } = await supabase
          .from("tier2_dashboard_insights")
          .select("overall_score")
          .eq("u_id", user?.u_id)
          .single();

        if (error || !data?.overall_score) {
          setError("Unable to load assessment score.");
          return;
        }

        setScore(data.overall_score);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchScore();
  }, [user?.u_id, skipCheck]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    if (score === null) {
      alert("Score is not loaded yet. Please try again.");
      return;
    }

    const isStepValid = isDynamicStepValid(score, step, formAnswers);

    if (!isStepValid) {
      alert("Please complete all required questions before continuing.");
      return;
    }

    const isLastStep = step >= 2;

    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!user?.u_id) {
      alert("User ID missing. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const sanitizedAnswers = stripUnusedOtherFields(formAnswers);

      const response = await fetch("/api/assessments/sales_performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: sanitizedAnswers,
          score: score,
          userId: user.u_id
        }),
      });

      const result = await response.json();

      if (!response.ok || result.salesPerformanceScore === undefined) {
        console.error("❌ Scoring API failed:", result);
        throw new Error(result.error || "Failed to score assessment");
      }

      // Store the full assessment in Supabase
      const { error: assessmentError } = await supabase
        .from("sales_performance_assessment")
        .upsert({
          u_id: user.u_id,
          answers: sanitizedAnswers,
          score: result.salesPerformanceScore,
          created_at: new Date().toISOString()
        }, {
          onConflict: "u_id"
        });

      if (assessmentError) {
        console.error("❌ Failed to save assessment:", assessmentError);
        throw new Error("Failed to save assessment");
      }

      // Update tier2_profiles with latest sales score and timestamp
      const { error: profileError } = await supabase
        .from("tier2_profiles")
        .upsert({
          u_id: user.u_id,
          sales_score: result.salesPerformanceScore,
          sales_last_taken: new Date().toISOString()
        }, {
          onConflict: "u_id"
        });

      if (profileError) {
        console.error("❌ Failed to update profile:", profileError);
        throw new Error("Failed to update profile");
      }

      router.push("/premium/assessment");
    } catch (err: unknown) {
      console.error("❌ Assessment submission failed:", err);
      setError(getErrorMessage(err));
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

      if (Array.isArray(value) && key && !getArrayAnswer(value).includes("other")) {
        updated[`${key}_other`] = "";
        updated[key] = value.filter((item: string) => !item.startsWith("Other:"));
      }

      return updated;
    });
  };

  if (loading) {
    return <div className="p-10 text-center">Loading your assessment...</div>;
  }

  if (score === null && !error) {
    return <div className="p-10 text-center">Still waiting for your score...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={step} total={3} />

        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {score !== null && (
                <StepGroupRenderer
                  step={step}
                  score={score}
                  answers={formAnswers}
                  onAnswer={handleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <button
              disabled={step === 0 || submitting}
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 min-w-[100px] ${
                submitting ? "cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : step === 2 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
