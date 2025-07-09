"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/lib/supabase";
import ReassessmentLearnMoreModal from "./ReassessmentLearnMoreModal";
import ReassessmentPromptModal from "./ReassessmentPromptModal";
import { FaChartLine, FaCheckCircle, FaClock, FaPlay, FaInfoCircle, FaArrowRight, FaTrophy, FaRocket } from "react-icons/fa";

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
        className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse"
      >
        <div className="p-8">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
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
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group overflow-hidden relative"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 mb-1">
                  Growth Progress Tracker
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    📈 Progress Assessment
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border shadow-sm ${
              canTakeReassessment 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              {canTakeReassessment ? <FaRocket className="text-sm" /> : <FaClock className="text-sm" />}
              {canTakeReassessment ? "Ready" : "Cooldown"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            Measure your business growth and track improvements across all key areas every 30 days.
          </p>

          {/* Content based on status */}
          {!canTakeReassessment && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FaClock className="text-blue-500 text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaInfoCircle className="text-white text-sm" />
                  </div>
                </div>
                
                {hasTaken ? (
                  <>
                    <div className="text-4xl font-extrabold text-blue-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
                    <div className="text-sm text-gray-600 font-medium">Current Score</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-extrabold text-gray-400 mb-2 tracking-tight">--</div>
                    <div className="text-sm text-gray-600 font-medium">No Score Yet</div>
                  </>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="space-y-3">
                  {hasTaken && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Taken:</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {format(new Date(lastTakenDate!), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      Cooldown Period
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-blue-800 text-xs font-medium flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    {hasTaken 
                      ? `You can retake this assessment in ${30 - (daysSinceLast || 0)} days to track your progress.`
                      : "You've established a baseline. You'll be able to track your progress after 30 days."
                    }
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleLearnMore}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 py-3 px-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <FaInfoCircle className="text-sm" />
                <span>Learn More</span>
                <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          )}

          {canTakeReassessment && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FaRocket className="text-green-500 text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                </div>
                
                {hasTaken && (
                  <>
                    <div className="text-4xl font-extrabold text-green-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
                    <div className="text-sm text-gray-600 font-medium">Previous Score</div>
                  </>
                )}
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
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
                
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-green-800 text-xs font-medium flex items-center gap-2">
                    <FaRocket className="text-green-600" />
                    {hasTaken 
                      ? "It's time to retake your assessment and see how much you've improved!"
                      : "You can now take your first reassessment to establish a baseline for tracking progress."
                    }
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleStartAssessment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-green-400/30"
              >
                <FaPlay className="text-sm" />
                <span>Start Reassessment</span>
                <FaArrowRight className="text-sm" />
              </motion.button>
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