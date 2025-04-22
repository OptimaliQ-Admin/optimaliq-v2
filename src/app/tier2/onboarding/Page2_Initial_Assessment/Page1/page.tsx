"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";
import Group01_Goals, { isGroup01Complete } from "./groups/Group01_Goals";
import Group02_Goals, { isGroup02Complete } from "./groups/Group02_Positioning";
import Group03_Goals, { isGroup03Complete } from "./groups/Group03_Operations";
import Group04_Goals, { isGroup04Complete } from "./groups/Group04_GrowthStack";
import Group05_Goals, { isGroup05Complete } from "./groups/Group05_Clarity";
import Group06_Goals, { isGroup06Complete } from "./groups/Group06_Benchmarks";
import Group07_Goals, { isGroup07Complete } from "./groups/Group07_Final";
import { generateDashboardScores } from "@/lib/ai/generateDashboard";
import { saveProfileScores } from "@/lib/sync/saveProfile";
import { saveDashboardInsights } from "@/lib/sync/saveDashboard";

const stepValidators: Record<number, (answers: Record<string, any>) => boolean> = {
  0: isGroup01Complete,
  1: isGroup02Complete,
  2: isGroup03Complete,
  3: isGroup04Complete,
  4: isGroup05Complete,
  5: isGroup06Complete,
  6: isGroup07Complete,
};

export default function OnboardingAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});
  const validator = stepValidators[step];

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("tier2_email") : null;
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

      if (!userEmail) {
        router.push("/pricing");
        return;
      }

      const { data, error } = await supabase
        .from("tier2_users")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (error || !data || data.subscription_status !== "active") {
        setError("Access Denied. Please subscribe first.");
        router.push("/pricing");
        return;
      }

      setLoading(false);
    };

    checkSubscription();
  }, [router, userEmail, skipCheck]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    const validator = stepValidators[step];
    if (validator && !validator(formAnswers)) {
      alert("Please complete all required questions before continuing.");
      return;
    }

    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      try {
        const sanitizedAnswers = stripUnusedOtherFields(formAnswers);

        const { data: userData, error: userError } = await supabase
          .from("tier2_users")
          .select("*")
          .eq("email", userEmail)
          .single();

        if (userError || !userData) {
          console.error("❌ User not found");
          return;
        }

        const userId = userData.user_id;

        const { error: insertError } = await supabase
          .from("onboarding_assessments")
          .insert([{ ...sanitizedAnswers, user_id: userId }]);

        if (insertError) {
          console.error("❌ Error inserting onboarding assessment:", insertError);
          return;
        }

        const aiScores = await generateDashboardScores(userData, sanitizedAnswers);
        if (!aiScores) {
          alert("Something went wrong generating AI scores");
          return;
        }

        await saveProfileScores(userId, {
          strategyScore: aiScores.strategyScore,
          processScore: aiScores.processScore,
          technologyScore: aiScores.technologyScore,
          overallScore: aiScores.score,
        });

        await saveDashboardInsights({
          user_id: userId,
          strategyScore: aiScores.strategyScore,
          processScore: aiScores.processScore,
          technologyScore: aiScores.technologyScore,
          score: aiScores.score,
          industryAvgScore: 3.2,
          topPerformerScore: 4.5,
          benchmarking: {},
          strengths: [],
          weaknesses: [],
          roadmap: [],
          chartData: [
            { month: "Now", userScore: aiScores.score, industryScore: 3.2, topPerformerScore: 4.5 },
            { month: "3 Months", userScore: Math.min(5, aiScores.score + 0.5), industryScore: 3.2, topPerformerScore: 4.5 },
            { month: "6 Months", userScore: Math.min(5, aiScores.score + 1), industryScore: 3.2, topPerformerScore: 4.5 },
            { month: "12 Months", userScore: Math.min(5, aiScores.score + 2), industryScore: 3.2, topPerformerScore: 4.5 },
          ],
          updated_at: new Date().toISOString(),
          industry: userData.industry?.trim().toLowerCase(),
        });

        router.push("/tier2/dashboard");
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

  if (loading) return <div className="p-10 text-center">Checking subscription...</div>;

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
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {step === 6 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}