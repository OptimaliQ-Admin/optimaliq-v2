"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "@/components/shared/ProgressBar";
import StepGroupRenderer from "@/components/shared/StepGroupRenderer";
import { isGroup01Complete } from "./groups/Group01_Goals"
import { isGroup02Complete } from "./groups/Group02_Positioning"
import { isGroup03Complete } from "./groups/Group03_Operations"
import { isGroup04Complete } from "./groups/Group04_GrowthStack"
import { isGroup05Complete } from "./groups/Group05_Clarity"
import { isGroup06Complete } from "./groups/Group06_Benchmarks"
import { isGroup07Complete } from "./groups/Group07_Final"
import { isGroup08Complete } from "./groups/Group08_TechTools"
import {
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import { getErrorMessage } from "@/utils/errorHandler";


const stepValidators: Record<number, (answers: AssessmentAnswers) => boolean> = {
  0: isGroup01Complete,
  1: isGroup02Complete,
  2: isGroup03Complete,
  3: isGroup04Complete,
  4: isGroup05Complete,
  5: isGroup06Complete,
  6: isGroup07Complete,
  7: isGroup08Complete,
};


export default function OnboardingAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});
  const [userId, setUserId] = useState<string | null>(null);
  const validator = stepValidators[step];

  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

  
  const stripUnusedOtherFields = (answers: AssessmentAnswers) => {
    const result: AssessmentAnswers = {};
  
    for (const key in answers) {
      if (key.endsWith("_other")) continue; // don't save _other fields
  
      result[key] = answers[key]; // pass everything else through
    }
  
    return result;
  };
  
  
  useEffect(() => {
    const checkSubscription = async () => {
      if (skipCheck) {
        setLoading(false);
        return;
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push("/pricing");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("tier2_users")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      if (error || !data || data.subscription_status !== "active") {
        setError("Access Denied. Please subscribe first.");
        router.push("/pricing");
        return;
      }

      setLoading(false);
    };

    checkSubscription();
  }, [router, skipCheck]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    const validator = stepValidators[step];
    if (validator && !validator(formAnswers)) {
      alert("Please complete all required questions before continuing.");
      return;
    }
  
    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      try {
        console.log("📤 Submitting formAnswers:", formAnswers);
  
        const sanitizedAnswers = stripUnusedOtherFields(formAnswers);
  
        // Save main assessment data
        const { data: assessmentData, error: assessmentError } = await supabase
          .from("tech_stack_assessment")
          .insert([{ ...sanitizedAnswers }]);
  
        if (assessmentError) {
          console.error("❌ Supabase error:", assessmentError);
          alert(`Something went wrong: ${assessmentError.message}`);
          return;
        }
  
        // Save tech tools data
        const techToolsData = [
          ...(Array.isArray(sanitizedAnswers.tech_tools_crm) ? sanitizedAnswers.tech_tools_crm : []).map((tool: string) => ({
            u_id: userId,
            category: 'crm',
            tool_name: tool
          })),
          ...(Array.isArray(sanitizedAnswers.tech_tools_esp) ? sanitizedAnswers.tech_tools_esp : []).map((tool: string) => ({
            u_id: userId,
            category: 'esp',
            tool_name: tool
          })),
          ...(Array.isArray(sanitizedAnswers.tech_tools_analytics) ? sanitizedAnswers.tech_tools_analytics : []).map((tool: string) => ({
            u_id: userId,
            category: 'analytics',
            tool_name: tool
          })),
          ...(Array.isArray(sanitizedAnswers.tech_tools_cms) ? sanitizedAnswers.tech_tools_cms : []).map((tool: string) => ({
            u_id: userId,
            category: 'cms',
            tool_name: tool
          }))
        ];

        if (techToolsData.length > 0) {
          const { error: toolsError } = await supabase
            .from("tech_stack_tools")
            .insert(techToolsData);

          if (toolsError) {
            console.error("❌ Supabase error saving tools:", toolsError);
            alert(`Something went wrong saving tools: ${toolsError.message}`);
            return;
          }
        }
  
        console.log("✅ Submission successful:", assessmentData);
        router.push("/dashboard/insights");
      } catch (err: unknown) {
        console.error("❌ Unexpected error:", err);
        alert(`Unexpected error: ${getErrorMessage(err)}`);
      }
    }
  };
  
  
  

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleAnswer = (key: string, value: AssessmentAnswerValue) => {
    setFormAnswers((prev) => {
      const updated = { ...prev, [key]: value };
  
      // 🔁 For any "other" text field
if (key.endsWith("_other")) {
  const baseKey = key.replace("_other", "");
  const baseValue = prev[baseKey];

  // Ensure baseValue is an array before calling .filter
  const cleaned =
    Array.isArray(baseValue)
      ? baseValue.filter((item: string) => !item.startsWith("Other:"))
      : [];

  // Ensure value is a string before using .trim()
  if (typeof value === "string" && value.trim()) {
    cleaned.push(`Other: ${value.trim()}`);
  }

  updated[baseKey] = cleaned;
}
  
      // 🔁 If a select field is updated and "other" was removed, clear its _other input
      if (Array.isArray(value) && key && !getArrayAnswer(value).includes("other")) {
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
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {step === 7 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
