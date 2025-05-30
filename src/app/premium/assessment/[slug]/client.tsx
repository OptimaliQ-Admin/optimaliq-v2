"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { getErrorMessage } from "@/utils/errorHandler";
import { isDynamicStepValid } from "@/lib/validation/isDynamicStepValid";
import { assessmentIntros, AssessmentType } from "@/components/assessments/AssessmentIntroModal";


import { useParams } from "next/navigation";

export default function DynamicAssessmentPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";

  const router = useRouter();
  const { user } = usePremiumUser();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});
  const [questionConfig, setQuestionConfig] = useState<any>(null);

  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await import(`@/lib/config/${slug}_question_config.json`);
        setQuestionConfig(config.default);
      } catch (err) {
        console.error("Failed to load question config:", err);
        setError("Invalid assessment type");
      }
    };

    loadConfig();
  }, [slug]);

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

    if (!questionConfig) {
      alert("Question configuration is not loaded yet. Please try again.");
      return;
    }

    const stepIsValid = isDynamicStepValid(score, step, formAnswers, questionConfig);

    if (!stepIsValid) {
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
      const response = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment: slug,
          answers: formAnswers,
          score: score,
          userId: user.u_id
        }),
      });

      const result = await response.json();

      if (!response.ok || result.score === undefined) {
        console.error("❌ Scoring API failed:", result);
        throw new Error(result.error || "Failed to score assessment");
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

  const handleAnswer = (key: string, value: any) => {
    setFormAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
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

  if (!questionConfig) {
    return <div className="p-10 text-center">Loading assessment configuration...</div>;
  }
  const slugToAssessmentType: Record<string, AssessmentType> = {
    bpm: "BPM",
    sales: "sales",
    tech_stack: "tech",
    strategic_maturity: "strategy",
    marketing_effectiveness: "marketing",
    ai_readiness: "ai",
    competitive_benchmarking: "benchmarking",
    customer_experience: "cx",
    digital_transformation: "digital",
    leadership: "leadership",
    reassessment: "reassessment",
  };
  
  let title = "Assessment";
if (slug in slugToAssessmentType) {
  const typeKey = slugToAssessmentType[slug];
  title = assessmentIntros[typeKey]?.title ?? "Assessment";
}
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <DynamicStepRenderer
  config={questionConfig}
  score={score || 0}
  step={step}
  answers={formAnswers}
  onAnswer={handleAnswer}
  assessmentType={slug}
/>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`px-6 py-2 rounded ${
              step === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className={`px-6 py-2 rounded ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : step === 2 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}