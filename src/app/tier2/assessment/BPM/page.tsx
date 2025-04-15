"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";
import { useTier2User } from "@/context/Tier2UserContext";


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
      const fetchData = async () => {
        console.log("👤 Email from context:", userEmail);
    
        if (!userEmail && !skipCheck) {
          console.log("🚫 No email and skipCheck is false");
          return;
        }
    
        try {
          const { data: userData, error: userError } = await supabase
            .from("tier2_users")
            .select("user_id")
            .eq("email", userEmail)
            .single();
    
          console.log("🧠 userData:", userData);
    
          if (userError || !userData) {
            console.log("❌ Access denied: User not found.");
            setError("Access Denied. Please subscribe first.");
            return;
          }
    
          const { data: insightsData, error: insightsError } = await supabase
            .from("insights")
            .select("overallscore")
            .eq("u_id", userData.user_id)
            .single();
    
          console.log("📊 insightsData:", insightsData);
    
          if (insightsError || !insightsData?.overallscore) {
            setError("Unable to load assessment score.");
            return;
          }
    
          setScore(insightsData.overallscore); // ← this is the key!
          setLoading(false);
        } catch (err) {
          console.error("❌ Unexpected error:", err);
          setError("An unexpected error occurred.");
        }
      };
    
      fetchData();
    }, [userEmail, skipCheck]);
    //router,
  
  

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      try {
        const sanitizedAnswers = stripUnusedOtherFields(formAnswers);
        const { data, error } = await supabase
          .from("onboarding_assessments")
          .insert([{ ...sanitizedAnswers, score }]);

        if (error) {
          console.error("❌ Supabase error:", error);
          alert(`Something went wrong: ${error.message}`);
          return;
        }

        router.push("/dashboard/insights");
      } catch (err: any) {
        console.error("❌ Unexpected error:", err);
        alert(`Unexpected error: ${err.message}`);
      }
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
