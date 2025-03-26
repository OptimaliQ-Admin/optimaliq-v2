"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";

export default function OnboardingAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});


  const userEmail = typeof window !== "undefined" ? localStorage.getItem("tier2_email") : null;
  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

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
        .select("subscription_status")
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
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      try {
        console.log("Submitting answers:", formAnswers);
  
        const { data, error } = await supabase
          .from("onboarding_assessments") // 👈 your Supabase table name here
          .insert([{ ...formAnswers }]); // optional: include user identifier
  
        if (error) {
          console.error("❌ Error submitting:", error);
          alert("Something went wrong. Please try again.");
        } else {
          console.log("✅ Submission successful:", data);
          router.push("/dashboard/insights"); // or a thank-you page
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        alert("Unexpected error. Please try again.");
      }
    }
  };
  

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleAnswer = (key: string, value: any) => {
    setFormAnswers((prev) => ({ ...prev, [key]: value }));
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
              <StepGroupRenderer step={step} answers={answers} onAnswer={handleAnswer} />
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
