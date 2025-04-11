"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { bpmFormMap } from "@/app/tier2/assessments/BPM";

export default function OnboardingAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState<number | null>(null);

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("tier2_email") : null;
  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

  const getScoreKey = (score: number): string => {
    if (score < 1.5) return "1.0";
    if (score < 2.0) return "1.5";
    if (score < 2.5) return "2.0";
    if (score < 3.0) return "2.5";
    if (score < 3.5) return "3.0";
    if (score < 4.0) return "3.5";
    if (score < 4.5) return "4.0";
    if (score < 5.0) return "4.5";
    return "5.0";
  };

  useEffect(() => {
    const checkSubscriptionAndFetchScore = async () => {
      if (!userEmail) {
        router.push("/pricing");
        return;
      }

      if (skipCheck) {
        setScore(2.5);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tier2_users")
        .select("gmf_score, subscription_status")
        .eq("email", userEmail)
        .single();

      if (error || !data || data.subscription_status !== "active") {
        setError("Access Denied. Please subscribe first.");
        router.push("/pricing");
        return;
      }

      setScore(data.gmf_score);
      setLoading(false);
    };

    checkSubscriptionAndFetchScore();
  }, [router, userEmail, skipCheck]);

  const handleAnswer = (key: string, value: any) => {
    setFormAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("bpm_assessment")
        .insert([{ ...formAnswers, overall_score: score }]);

      if (error) throw error;

      router.push("/dashboard/insights");
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Checking subscription and loading assessment...</div>;

  const scoreKey = score !== null ? getScoreKey(score) : "";
  const SelectedForm = bpmFormMap[scoreKey];

  if (!SelectedForm) {
    return <div className="p-10 text-center text-red-600">No form available for score {scoreKey}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <SelectedForm answers={formAnswers} onAnswer={handleAnswer} />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
