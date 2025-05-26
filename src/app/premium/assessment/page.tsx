// src/app/tier2/assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import AssessmentCard from "@/components/assessment/AssessmentCard";
import { assessments } from "@/lib/utils/assessmentMeta";

export default function AssessmentsPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<{
    [key: string]: {
      score: number | null;
      lastTakenDate: string | null;
    };
  }>({});

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!user?.u_id) return;

      try {
        // Fetch scores from tier2_profiles
        const { data: profileData, error: profileError } = await supabase
          .from("tier2_profiles")
          .select("sales_score, sales_last_taken, tech_score, tech_last_taken, strategy_score, strategy_last_taken, marketing_score, marketing_last_taken, customer_score, customer_last_taken, digital_score, digital_last_taken, leadership_score, leadership_last_taken, growth_score, growth_last_taken, ai_score, ai_last_taken")
          .eq("u_id", user.u_id)
          .single();

        if (profileError) throw profileError;

        // Fetch scores from score tables
        const { data: scoreData, error: scoreError } = await supabase
          .from("score_sales_performance")
          .select("gmf_score, created_at")
          .eq("u_id", user.u_id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (scoreError) throw scoreError;

        // Combine the data
        setAssessmentData({
          sales: {
            score: profileData?.sales_score || null,
            lastTakenDate: profileData?.sales_last_taken || null
          },
          bpm: {
            score: scoreData?.[0]?.gmf_score || null,
            lastTakenDate: scoreData?.[0]?.created_at || null
          },
          tech: {
            score: profileData?.tech_score || null,
            lastTakenDate: profileData?.tech_last_taken || null
          },
          strategy: {
            score: profileData?.strategy_score || null,
            lastTakenDate: profileData?.strategy_last_taken || null
          },
          marketing: {
            score: profileData?.marketing_score || null,
            lastTakenDate: profileData?.marketing_last_taken || null
          },
          customer: {
            score: profileData?.customer_score || null,
            lastTakenDate: profileData?.customer_last_taken || null
          },
          digital: {
            score: profileData?.digital_score || null,
            lastTakenDate: profileData?.digital_last_taken || null
          },
          leadership: {
            score: profileData?.leadership_score || null,
            lastTakenDate: profileData?.leadership_last_taken || null
          },
          growth: {
            score: profileData?.growth_score || null,
            lastTakenDate: profileData?.growth_last_taken || null
          },
          ai: {
            score: profileData?.ai_score || null,
            lastTakenDate: profileData?.ai_last_taken || null
          },
          reassessment: {
            score: null,
            lastTakenDate: null
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching assessment data:", err);
        setError("Failed to load assessment data");
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [user?.u_id]);

  if (loading) {
    return <div className="p-10 text-center">Loading assessments...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Assessments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <AssessmentCard
            key={assessment.slug}
            slug={assessment.slug}
            title={assessment.title}
            description={assessment.description}
            score={assessmentData[assessment.slug]?.score ?? null}
            lastTakenDate={assessmentData[assessment.slug]?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
        ))}
      </div>
    </div>
  );
}