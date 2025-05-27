// src/app/tier2/assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import AssessmentCard from "@/components/assessment/AssessmentCard";
import { assessmentFieldMap } from "@/lib/utils/assessmentFieldMap";

type AssessmentSlug = keyof typeof assessmentFieldMap;
type ProfileData = Record<string, number | string | null>;

export default function AssessmentsPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<Record<AssessmentSlug, { score: number | null; lastTakenDate: string | null }>>({} as Record<AssessmentSlug, { score: number | null; lastTakenDate: string | null }>);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.u_id) return;

      try {
        const selectFields = Object.values(assessmentFieldMap)
          .flatMap(({ scoreField, lastTakenField }) => [scoreField, lastTakenField])
          .join(", ");

        const { data: profileData, error: profileError } = await supabase
          .from("tier2_profiles")
          .select(selectFields)
          .eq("u_id", user.u_id)
          .single();

        if (profileError) {
          console.error("❌ Failed to fetch profile data:", profileError);
          setError("Failed to load assessment data");
          return;
        }

        if (!profileData) {
          setError("No profile data found");
          return;
        }

        const assessments = Object.keys(assessmentFieldMap) as AssessmentSlug[];
        const data = assessments.reduce((acc, slug) => {
          const mapping = assessmentFieldMap[slug];
          const profile = profileData as unknown as ProfileData;
          acc[slug] = {
            score: profile[mapping.scoreField] as number | null,
            lastTakenDate: profile[mapping.lastTakenField] as string | null
          };
          return acc;
        }, {} as Record<AssessmentSlug, { score: number | null; lastTakenDate: string | null }>);

        setAssessmentData(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred");
      }
    };

    fetchProfileData();
  }, [user?.u_id]);

  if (loading) {
    return <div className="p-10 text-center">Loading assessments...</div>;
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Assessments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AssessmentCard
          slug="sales"
          title="Sales Performance"
          description="Evaluate your sales pipeline and conversions."
          score={assessmentData.sales?.score ?? null}
          lastTakenDate={assessmentData.sales?.lastTakenDate ?? null}
          userId={user?.u_id}
        />
      </div>
    </div>
  );
}