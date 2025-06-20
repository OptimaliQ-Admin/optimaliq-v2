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
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
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
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between group"
      >
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📈</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Growth Progress Tracker</h3>
          </div>
          <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3" />
          <p className="text-gray-500 text-base leading-relaxed">Measure your business growth and track improvements across all key areas every 30 days.</p>
        </div>

        {!canTakeReassessment && (
          <div className="space-y-4">
            {hasTaken ? (
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{roundedScore?.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-medium">Current Score</div>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-400 mb-2">--</div>
                <div className="text-sm text-gray-600 font-medium">No Score Yet</div>
              </div>
            )}
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  Cooldown Period
                </span>
              </div>
              
              {hasTaken && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Taken:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {format(new Date(lastTakenDate!), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-blue-800 text-sm font-medium">
                {hasTaken 
                  ? `You can retake this assessment in ${30 - (daysSinceLast || 0)} days to track your progress.`
                  : "You've established a baseline. You'll be able to track your progress after 30 days."
                }
              </p>
            </div>
            
            <motion.button
              onClick={handleLearnMore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 py-2 px-4 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              Learn More →
            </motion.button>
          </div>
        )}

        {canTakeReassessment && (
          <div className="space-y-4">
            {hasTaken && (
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">{roundedScore?.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-medium">Previous Score</div>
              </div>
            )}
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                  Ready to Track Progress
                </span>
              </div>
              
              {hasTaken && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Taken:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {format(new Date(lastTakenDate!), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-800 text-sm font-medium">
                {hasTaken 
                  ? "It's time to retake your assessment and see how much you've improved!"
                  : "You can now take your first reassessment to establish a baseline for tracking progress."
                }
              </p>
            </div>
            
            <motion.button
              onClick={handleStartAssessment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaPlay className="text-sm" />
              <span>Start Reassessment</span>
            </motion.button>
          </div>
        )}
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