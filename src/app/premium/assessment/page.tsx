// src/app/premium/assessment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import AssessmentCard from "@/components/assessments/AssessmentCard";
import ReassessmentCard from "@/components/assessments/ReassessmentCard";
import { assessmentFieldMap } from "@/lib/utils/assessmentFieldMap";
import TechToolsCard from "@/components/assessment/TechToolsCard";
import AssessmentExplanationModal from "@/components/modals/AssessmentExplanationModal";
import { FaChartLine, FaLightbulb, FaRocket } from "react-icons/fa";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaRocket className="text-white text-2xl" />
          </div>
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaChartLine className="text-sm" />
              <span>Premium Assessments</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Strategic Business Assessments
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive evaluations to measure and improve your business performance across all critical areas.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FaLightbulb className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600">Get personalized recommendations based on your unique business profile</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your improvement over time with detailed analytics</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Plans</h3>
                <p className="text-sm text-gray-600">Receive specific strategies to accelerate your growth</p>
              </div>
            </div>
          </motion.div>

          {/* Assessment Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
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
            <ReassessmentCard
              score={assessmentData.reassessment?.score ?? null}
              lastTakenDate={assessmentData.reassessment?.lastTakenDate ?? null}
              userId={user?.u_id}
            />
            {user?.u_id && <TechToolsCard userId={user.u_id} />}
          </motion.div>
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