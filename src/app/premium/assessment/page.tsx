// src/app/tier2/assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import AssessmentCard from "@/components/assessment/AssessmentCard";

export default function AssessmentsPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<{
    score: number | null;
    lastTakenDate: string | null;
  }>({
    score: null,
    lastTakenDate: null
  });

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!user?.u_id) return;

      try {
        // Fetch only sales assessment data from tier2_profiles
        const { data: profileData, error: profileError } = await supabase
          .from("tier2_profiles")
          .select("sales_score, sales_last_taken")
          .eq("u_id", user.u_id)
          .single();

        if (profileError) throw profileError;

        setAssessmentData({
          score: profileData?.sales_score || null,
          lastTakenDate: profileData?.sales_last_taken || null
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
        <AssessmentCard
          slug="sales"
          title="Sales Performance"
          description="Evaluate your sales pipeline and conversions."
          score={assessmentData.score}
          lastTakenDate={assessmentData.lastTakenDate}
          userId={user?.u_id}
        />
      </div>
    </div>
  );
}