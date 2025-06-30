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
import PageNavigation from "@/components/shared/PageNavigation";
import { FaChartLine, FaLightbulb, FaRocket, FaBullseye, FaCogs, FaBrain, FaUsers, FaShieldAlt } from "react-icons/fa";

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

  // Define page sections for navigation
  const pageSections = [
    { id: "header", label: "Overview", icon: "📊" },
    { id: "business-assessments", label: "Business Assessments", icon: "🏢" },
    { id: "technology-assessments", label: "Technology Assessments", icon: "💻" },
    { id: "strategy-assessments", label: "Strategy Assessments", icon: "🎯" },
    { id: "progress-tracking", label: "Progress Tracking", icon: "📈" },
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <FaChartLine className="text-white text-3xl" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading assessments...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-200 max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FaRocket className="text-white text-3xl" />
          </div>
          <p className="text-red-600 mb-6 text-lg font-semibold">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Floating Page Navigation */}
        <PageNavigation sections={pageSections} />

        <div className="max-w-[1920px] mx-auto p-8 space-y-16">
          {/* Header Section */}
          <motion.div 
            id="header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
            >
              Strategic Business Assessments
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Comprehensive evaluations to measure and improve your business performance across all critical areas.
            </motion.p>
          </motion.div>

          {/* Business Assessments Section */}
          <motion.div 
            id="business-assessments"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCogs className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Business Process Assessments</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Evaluate your core business operations and identify opportunities for optimization
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                slug="marketing_effectiveness"
                title="Marketing Effectiveness"
                description="Measure how well your marketing drives engagement and results."
                score={assessmentData.marketing_effectiveness?.score ?? null}
                lastTakenDate={assessmentData.marketing_effectiveness?.lastTakenDate ?? null}
                userId={user?.u_id}
              />
            </div>
          </motion.div>

          {/* Technology Assessments Section */}
          <motion.div 
            id="technology-assessments"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBrain className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Technology Assessments</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Assess your digital capabilities and technology readiness for growth
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssessmentCard
                slug="tech_stack"
                title="Technology Maturity Assessment"
                description="Evaluate your technology infrastructure and digital capabilities."
                score={assessmentData.tech_stack?.score ?? null}
                lastTakenDate={assessmentData.tech_stack?.lastTakenDate ?? null}
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
                slug="digital_transformation"
                title="Digital Transformation"
                description="Evaluate your readiness for digital transformation success."
                score={assessmentData.digital_transformation?.score ?? null}
                lastTakenDate={assessmentData.digital_transformation?.lastTakenDate ?? null}
                userId={user?.u_id}
              />
            </div>
          </motion.div>

          {/* Strategy Assessments Section */}
          <motion.div 
            id="strategy-assessments"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBullseye className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Strategy & Leadership Assessments</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Evaluate your strategic planning, competitive position, and team effectiveness
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssessmentCard
                slug="strategic_maturity"
                title="Strategic Maturity"
                description="Evaluate your organization's strategic planning and execution."
                score={assessmentData.strategic_maturity?.score ?? null}
                lastTakenDate={assessmentData.strategic_maturity?.lastTakenDate ?? null}
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
                slug="leadership"
                title="Leadership & Team Performance"
                description="Assess team alignment, leadership effectiveness, and culture."
                score={assessmentData.leadership?.score ?? null}
                lastTakenDate={assessmentData.leadership?.lastTakenDate ?? null}
                userId={user?.u_id}
              />
            </div>
          </motion.div>

          {/* Customer Experience Assessment */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Customer Experience Assessment</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Understand your customer experience performance and opportunities for improvement
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssessmentCard
                slug="customer_experience"
                title="Customer Experience"
                description="Understand your CX performance and opportunities to improve."
                score={assessmentData.customer_experience?.score ?? null}
                lastTakenDate={assessmentData.customer_experience?.lastTakenDate ?? null}
                userId={user?.u_id}
              />
            </div>
          </motion.div>

          {/* Progress Tracking Section */}
          <motion.div 
            id="progress-tracking"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Progress Tracking & Technology</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Monitor your growth journey and manage your technology infrastructure
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ReassessmentCard
                score={assessmentData.reassessment?.score ?? null}
                lastTakenDate={assessmentData.reassessment?.lastTakenDate ?? null}
                userId={user?.u_id}
              />
              {user?.u_id && <TechToolsCard userId={user.u_id} />}
            </div>
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