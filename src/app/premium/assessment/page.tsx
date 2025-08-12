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
// Salesforce-style shell for assessments: sticky header + tabs
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

  const [activeTab, setActiveTab] = useState<'overview'|'business'|'technology'|'strategy'|'progress'>('overview');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        const selectFields = Object.values(assessmentFieldMap)
          .flatMap(({ scoreField, lastTakenField }) => [scoreField, lastTakenField])
          .join(", ") + ", assessment_explanation_seen_at";

        const { data: profileData, error: profileError } = await supabase
          .from("tier2_profiles")
          .select(selectFields)
          .eq("u_id", user.id)
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
  }, [user?.id]);

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
      <div className="min-h-screen bg-gray-50">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Assessments</h1>
              <p className="text-xs text-gray-500">Plan, take, and review assessments</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">Overview</span>
              <span>•</span>
              <span>Business</span>
              <span>•</span>
              <span>Technology</span>
              <span>•</span>
              <span>Strategy</span>
              <span>•</span>
              <span>Progress</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="max-w-[1920px] mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar text-sm">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'business', label: 'Business' },
                { key: 'technology', label: 'Technology' },
                { key: 'strategy', label: 'Strategy' },
                { key: 'progress', label: 'Progress' },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                  className={`px-4 py-2 border-b-2 -mb-px ${activeTab===t.key ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto p-6 space-y-10">
          {/* Header Section (Overview tab) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${activeTab==='overview' ? 'block' : 'hidden'} text-center`}
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

            {/* Enhanced Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            >
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaLightbulb className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">AI-Powered Insights</h3>
                <p className="text-gray-600 leading-relaxed">Get personalized recommendations based on your unique business profile</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">Monitor your improvement over time with detailed analytics</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaRocket className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Actionable Plans</h3>
                <p className="text-gray-600 leading-relaxed">Receive specific strategies to accelerate your growth</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaBullseye className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Strategic Focus</h3>
                <p className="text-gray-600 leading-relaxed">Identify key areas for improvement and strategic opportunities</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Business Assessments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`${activeTab==='business' ? 'block' : 'hidden'} space-y-8`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssessmentCard
                slug="bpm"
                title="Business Process Maturity"
                description="Analyze your internal workflows and process scalability."
                score={assessmentData.bpm?.score ?? null}
                lastTakenDate={assessmentData.bpm?.lastTakenDate ?? null}
                userId={user?.id}
              />
              <AssessmentCard
                slug="sales"
                title="Sales Performance"
                description="Evaluate your sales pipeline and conversions."
                score={assessmentData.sales?.score ?? null}
                lastTakenDate={assessmentData.sales?.lastTakenDate ?? null}
                userId={user?.id}
              />
              <AssessmentCard
                slug="marketing_effectiveness"
                title="Marketing Effectiveness"
                description="Measure how well your marketing drives engagement and results."
                score={assessmentData.marketing_effectiveness?.score ?? null}
                lastTakenDate={assessmentData.marketing_effectiveness?.lastTakenDate ?? null}
                userId={user?.id}
              />
            </div>
          </motion.div>

          {/* Technology Assessments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className={`${activeTab==='technology' ? 'block' : 'hidden'} space-y-8`}
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
                userId={user?.id}
              />
              <AssessmentCard
                slug="ai_readiness"
                title="AI & Automation Readiness"
                description="Assess how prepared you are to leverage AI and automation at scale."
                score={assessmentData.ai_readiness?.score ?? null}
                lastTakenDate={assessmentData.ai_readiness?.lastTakenDate ?? null}
                userId={user?.id}
              />
              <AssessmentCard
                slug="digital_transformation"
                title="Digital Transformation"
                description="Evaluate your readiness for digital transformation success."
                score={assessmentData.digital_transformation?.score ?? null}
                lastTakenDate={assessmentData.digital_transformation?.lastTakenDate ?? null}
                userId={user?.id}
              />
            </div>
          </motion.div>

          {/* Strategy Assessments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className={`${activeTab==='strategy' ? 'block' : 'hidden'} space-y-8`}
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
                userId={user?.id}
              />
              <AssessmentCard
                slug="competitive_benchmarking"
                title="Competitive Benchmarking"
                description="See how you stack up against peers and top performers."
                score={assessmentData.competitive_benchmarking?.score ?? null}
                lastTakenDate={assessmentData.competitive_benchmarking?.lastTakenDate ?? null}
                userId={user?.id}
              />
              <AssessmentCard
                slug="leadership"
                title="Leadership & Team Performance"
                description="Assess team alignment, leadership effectiveness, and culture."
                score={assessmentData.leadership?.score ?? null}
                lastTakenDate={assessmentData.leadership?.lastTakenDate ?? null}
                userId={user?.id}
              />
            </div>
          </motion.div>

          {/* Customer Experience Assessment (stays with Strategy section or could be in Business) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className={`${activeTab==='strategy' ? 'block' : 'hidden'} space-y-8`}
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
                userId={user?.id}
              />
            </div>
          </motion.div>

          {/* Progress Tracking Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className={`${activeTab==='progress' ? 'block' : 'hidden'} space-y-8`}
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
                userId={user?.id}
              />
              {user?.id && <TechToolsCard userId={user.id} />}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Assessment Explanation Modal */}
      {user?.id && (
        <AssessmentExplanationModal
          isOpen={showExplanationModal}
          onClose={handleCloseModal}
          userId={user.id}
        />
      )}
    </>
  );
}