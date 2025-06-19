"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/lib/supabase";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import ReassessmentLearnMoreModal from "./ReassessmentLearnMoreModal";
import ReassessmentPromptModal from "./ReassessmentPromptModal";

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <SectionTitleBar title="Growth Progress Tracker" />
        <p className="text-gray-600 mb-4">
          Measure your business growth and track improvements across all key areas every 30 days.
        </p>

        {!canTakeReassessment && (
          <>
            {hasTaken ? (
              <>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Score:</span>
                  <span className="ml-2 text-3xl font-bold text-blue-600">
                    {roundedScore?.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    You can retake this assessment in {30 - (daysSinceLast || 0)} days to track your progress.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm mb-3">
                  You've established a baseline. You&apos;ll be able to track your progress after 30 days.
                </p>
              </div>
            )}
            <button
              onClick={handleLearnMore}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Learn More
            </button>
          </>
        )}

        {canTakeReassessment && (
          <>
            {hasTaken && (
              <>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Previous Score:</span>
                  <span className="ml-2 text-3xl font-bold text-blue-600">
                    {roundedScore?.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                </p>
              </>
            )}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 text-sm font-medium">
                {hasTaken ? "Ready to track your progress!" : "Ready to establish your baseline!"}
              </p>
              <p className="text-green-700 text-sm mt-1">
                Take this assessment to measure your growth and see how your business has evolved.
              </p>
            </div>
            <button
              onClick={() => setShowPrompt(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {hasTaken ? "Retake Assessment" : "Start Assessment"}
            </button>
          </>
        )}
      </div>

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