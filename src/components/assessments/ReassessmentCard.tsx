"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/lib/supabase";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import ReassessmentLearnMoreModal from "./ReassessmentLearnMoreModal";
import ReassessmentPromptModal from "./ReassessmentPromptModal";
import { FaChartLine, FaCheckCircle, FaClock, FaPlay, FaInfoCircle } from "react-icons/fa";

type ReassessmentCardProps = {
  score: number | null;
  lastTakenDate: string | null;
  userId?: string;
};

export default function ReassessmentCard({
  score,
  lastTakenDate,
  userId,
}: ReassessmentCardProps) {
  const router = useRouter();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [profileCreatedAt, setProfileCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("tier2_profiles")
          .select("created_at")
          .eq("u_id", userId)
          .single();

        if (!error && data) {
          setProfileCreatedAt(data.created_at);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleLearnMore = () => {
    setShowLearnMore(true);
  };

  const handleCloseLearnMore = () => {
    setShowLearnMore(false);
  };

  const handleStartAssessment = () => {
    setShowPrompt(false);
    router.push("/premium/assessment/reassessment");
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  const hasTaken = score !== null && lastTakenDate !== null;
  const daysSinceLast = lastTakenDate
    ? differenceInDays(new Date(), new Date(lastTakenDate))
    : null;

  const daysSinceProfileCreation = profileCreatedAt
    ? differenceInDays(new Date(), new Date(profileCreatedAt))
    : null;

  // Can take reassessment if:
  // 1. Never taken before AND profile is older than 30 days, OR
  // 2. Taken before AND it's been more than 30 days since last taken
  const canTakeReassessment = 
    (!hasTaken && daysSinceProfileCreation !== null && daysSinceProfileCreation >= 30) ||
    (hasTaken && daysSinceLast !== null && daysSinceLast >= 30);

  // Show prompt if they can take it and haven't dismissed it
  useEffect(() => {
    if (canTakeReassessment && !loading) {
      setShowPrompt(true);
    }
  }, [canTakeReassessment, loading]);

  const roundedScore = score !== null ? Math.floor(score * 2) / 2 : null;

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden group"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 flex items-center gap-1">
              <FaCheckCircle className="text-xs" />
              <span>Progress Tracker</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Growth Progress Tracker</h3>
          <p className="text-green-100 text-sm leading-relaxed">
            Measure your business growth and track improvements across all key areas every 30 days.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!canTakeReassessment && (
            <div className="space-y-4">
              {hasTaken ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 mb-4">
                    <FaClock className="text-blue-600 text-sm" />
                    <span className="text-blue-700 text-sm font-semibold">Cooldown Period</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Current Score:</span>
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {roundedScore?.toFixed(1)}
                    </div>
                    <span className="text-sm text-gray-500">out of 5.0</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                    Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-blue-800 text-sm font-medium">
                      You can retake this assessment in {30 - (daysSinceLast || 0)} days to track your progress.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200 mb-4">
                    <FaInfoCircle className="text-yellow-600 text-sm" />
                    <span className="text-yellow-700 text-sm font-semibold">Establishing Baseline</span>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                    <p className="text-yellow-800 text-sm font-medium mb-3">
                      You&apos;ve established a baseline. You&apos;ll be able to track your progress after 30 days.
                    </p>
                  </div>
                </div>
              )}
              
              <motion.button
                onClick={handleLearnMore}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FaInfoCircle className="text-sm" />
                <span>Learn More</span>
              </motion.button>
            </div>
          )}

          {canTakeReassessment && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-4">
                  <FaCheckCircle className="text-green-600 text-sm" />
                  <span className="text-green-700 text-sm font-semibold">Ready to Track Progress</span>
                </div>
                
                {hasTaken && (
                  <>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Previous Score:</span>
                      <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {roundedScore?.toFixed(1)}
                      </div>
                      <span className="text-sm text-gray-500">out of 5.0</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                      Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                    </p>
                  </>
                )}
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-green-800 text-sm font-medium">
                    {hasTaken ? "Ready to track your progress!" : "Ready to establish your baseline!"}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Take this assessment to measure your growth and see how your business has evolved.
                  </p>
                </div>
                
                <motion.button
                  onClick={() => setShowPrompt(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaPlay className="text-sm" />
                  <span>{hasTaken ? "Retake Assessment" : "Start Assessment"}</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <ReassessmentLearnMoreModal
        isOpen={showLearnMore}
        onClose={handleCloseLearnMore}
      />

      <ReassessmentPromptModal
        isOpen={showPrompt}
        onClose={handleClosePrompt}
        onStart={handleStartAssessment}
        hasTakenBefore={hasTaken}
      />
    </>
  );
} 