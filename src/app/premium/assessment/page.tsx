// src/app/premium/assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import AssessmentCard from "@/components/assessments/AssessmentCard";
import { assessmentFieldMap } from "@/lib/utils/assessmentFieldMap";
import TechToolsCard from "@/components/assessment/TechToolsCard";
import AssessmentExplanationModal from "@/components/modals/AssessmentExplanationModal";

type AssessmentSlug = keyof typeof assessmentFieldMap;
type ProfileData = Record<string, number | string | null> & {
  assessment_explanation_seen_at: string | null;
};

export default function AssessmentsPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<Record<AssessmentSlug, { score: number | null; lastTakenDate: string | null }>>({} as Record<AssessmentSlug, { score: number | null; lastTakenDate: string | null }>);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [explanationSeen, setExplanationSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.u_id) return;

      try {
        const selectFields = Object.values(assessmentFieldMap)
          .flatMap(({ scoreField, lastTakenField }) => [scoreField, lastTakenField])
          .join(", ") + ", assessment_explanation_seen_at";

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

        // Check if user has seen the explanation
        const hasSeenExplanation = (profileData as unknown as ProfileData).assessment_explanation_seen_at !== null;
        setExplanationSeen(hasSeenExplanation);

        // Show modal if user hasn't seen explanation
        if (!hasSeenExplanation) {
          setShowExplanationModal(true);
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

  const handleCloseModal = () => {
    setShowExplanationModal(false);
    setExplanationSeen(true);
  };

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
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Assessments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AssessmentCard
            slug="bpm"
            title="Business Process Maturity"
            description="Analyze your internal workflows and process scalability."
            score={assessmentData.bpm?.score ?? null}
            lastTakenDate={assessmentData.bpm?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="sales"
            title="Sales Performance"
            description="Evaluate your sales pipeline and conversions."
            score={assessmentData.sales?.score ?? null}
            lastTakenDate={assessmentData.sales?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="tech_stack"
            title="Technology Maturity Assessment"
            description="Evaluate your technology infrastructure and digital capabilities."
            score={assessmentData.tech_stack?.score ?? null}
            lastTakenDate={assessmentData.tech_stack?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="strategic_maturity"
            title="Strategic Maturity"
            description="Evaluate your organization's strategic planning and execution."
            score={assessmentData.strategic_maturity?.score ?? null}
            lastTakenDate={assessmentData.strategic_maturity?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="marketing_effectiveness"
            title="Marketing Effectiveness"
            description="Measure how well your marketing drives engagement and results."
            score={assessmentData.marketing_effectiveness?.score ?? null}
            lastTakenDate={assessmentData.marketing_effectiveness?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="ai_readiness"
            title="AI & Automation Readiness"
            description="Assess how prepared you are to leverage AI and automation at scale."
            score={assessmentData.ai_readiness?.score ?? null}
            lastTakenDate={assessmentData.ai_readiness?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="competitive_benchmarking"
            title="Competitive Benchmarking"
            description="See how you stack up against peers and top performers."
            score={assessmentData.competitive_benchmarking?.score ?? null}
            lastTakenDate={assessmentData.competitive_benchmarking?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="customer_experience"
            title="Customer Experience"
            description="Understand your CX performance and opportunities to improve."
            score={assessmentData.customer_experience?.score ?? null}
            lastTakenDate={assessmentData.customer_experience?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="digital_transformation"
            title="Digital Transformation"
            description="Evaluate your readiness for digital transformation success."
            score={assessmentData.digital_transformation?.score ?? null}
            lastTakenDate={assessmentData.digital_transformation?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="leadership"
            title="Leadership & Team Performance"
            description="Assess team alignment, leadership effectiveness, and culture."
            score={assessmentData.leadership?.score ?? null}
            lastTakenDate={assessmentData.leadership?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          <AssessmentCard
            slug="reassessment"
            title="Progress Reassessment"
            description="Track your improvement over time with a periodic check-in."
            score={assessmentData.reassessment?.score ?? null}
            lastTakenDate={assessmentData.reassessment?.lastTakenDate ?? null}
            userId={user?.u_id}
          />
          {user?.u_id && <TechToolsCard userId={user.u_id} />}
        </div>
      </div>

      {/* Assessment Explanation Modal */}
      {user?.u_id && (
        <AssessmentExplanationModal
          isOpen={showExplanationModal}
          onClose={handleCloseModal}
          userId={user.u_id}
        />
      )}
    </>
  );
}