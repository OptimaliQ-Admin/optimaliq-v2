//src/app/tier2/assessment/BPM/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";
import { useTier2User } from "@/context/Tier2UserContext";
import { normalizeScore, validatorSets } from "./StepGroupRenderer"; // adjust path if needed



export default function OnboardingAssessmentPage() {
    const router = useRouter();
    const { user } = useTier2User(); // ✅ call it here
    const userEmail = user?.email;
    const [step, setStep] = useState(0);
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});
  
    const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";
  
  

  const stripUnusedOtherFields = (answers: Record<string, any>) => {
    const result: Record<string, any> = {};
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
  
      // If no user email, redirect to pricing
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
  
        setLoading(false); // ✅ allowed
      } catch (err) {
        console.error("❌ Error checking subscription:", err);
        setError("Something went wrong. Try again later.");
      }
    };
  
    checkSubscription();
  }, [router, user?.email, skipCheck]);
  
  useEffect(() => {

    const fetchScore = async () => {
      if (!user?.user_id && !skipCheck) return;

      try {
        const { data, error } = await supabase
          .from("tier2_dashboard_insights")
          .select("score")
          .eq("user_id", user?.user_id)
          .single();

        if (error || !data?.score) {
          setError("Unable to load assessment score.");
          return;
        }

        setScore(data.score);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchScore();
  }, [user?.user_id, skipCheck]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);


const handleNext = async () => {
  if (score === null) {
    alert("Score is not loaded yet. Please try again.");
    return;
  }
  const normalized = normalizeScore(score);
  const validator = validatorSets[normalized]?.[step];
  const isStepValid = validator ? validator(formAnswers) : true;

  if (!isStepValid) {
    alert("Please complete all required questions before continuing.");
    return;
  }
  const isLastStep = step >= 2;

  if (!isLastStep) {
    setStep((prev) => prev + 1);
    return;
  }

  if (!user?.user_id) {
    alert("User ID missing. Please try again.");
    return;
  }

    try {
      const sanitizedAnswers = stripUnusedOtherFields(formAnswers);
      // Step 1: Call your scoring API
      const response = await fetch("/api/tier2/assessments/bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: sanitizedAnswers,
          score: score,
          userId: user.user_id  // 👈 pass this along
        }),
      });      

const result = await response.json();

if (!response.ok || result.bpmScore === undefined) {
  console.error("❌ Scoring API failed:", result);
  alert("Something went wrong while scoring the assessment.");
  return;
}

const bpmScore = result.bpmScore;

// Step 2: Insert into Supabase
const { data, error }: { data: any; error: any } = await supabase
  .from("bpm_assessment")
  .insert([{ ...sanitizedAnswers, score: bpmScore, u_id: user.user_id }]);

if (error) {
  console.error("❌ Supabase error:", error);
  alert(`Something went wrong: ${error.message}`);
  return;
}

router.push("/tier2/assessment");

      if (error) {
        console.error("❌ Supabase error:", error);
        alert(`Something went wrong: ${error.message}`);
        return;
      }

      router.push("/tier2/assessment");
    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  };


  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleAnswer = (key: string, value: any) => {
    setFormAnswers((prev) => {
      const updated = { ...prev, [key]: value };

      if (key.endsWith("_other")) {
        const baseKey = key.replace("_other", "");
        const baseValue = prev[baseKey] || [];
        const cleaned = baseValue.filter((item: string) => !item.startsWith("Other:"));
        if (value.trim()) cleaned.push(`Other: ${value.trim()}`);
        updated[baseKey] = cleaned;
      }

      if (Array.isArray(value) && key && !value.includes("other")) {
        updated[`${key}_other`] = "";
        updated[key] = value.filter((item: string) => !item.startsWith("Other:"));
      }

      return updated;
    });
  };

  if (loading )
    return <div className="p-10 text-center">Loading your assessment...</div>;
  
  if (score === null && !error)
    return <div className="p-10 text-center">Still waiting for your score...</div>;

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
              disabled={step === 0}
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {step === 2 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
