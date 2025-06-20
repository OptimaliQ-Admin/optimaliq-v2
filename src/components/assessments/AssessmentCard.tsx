"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import AssessmentIntroModal, {
  AssessmentType,
} from "./AssessmentIntroModal"; 
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import { FaChartLine, FaCheckCircle, FaExclamationTriangle, FaPlay } from "react-icons/fa";

const slugToAssessmentType: Record<string, AssessmentType> = {
  bpm: "BPM",
  sales: "sales",
  tech_stack: "tech",
  strategic_maturity: "strategy",
  marketing_effectiveness: "marketing",
  ai_readiness: "ai",
  competitive_benchmarking: "benchmarking",
  customer_experience: "cx",
  digital_transformation: "digital",
  leadership: "leadership",
  reassessment: "reassessment",
};

type AssessmentCardProps = {
  slug: string;
  title: string;
  description: string;
  score: number | null;
  lastTakenDate: string | null;
  userId?: string;
};

export default function AssessmentCard({
  slug,
  title,
  description,
  score,
  lastTakenDate,
  userId,
}: AssessmentCardProps) {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  const handleClick = () => {
    setShowIntro(true);
  };

  const handleClose = () => {
    setShowIntro(false);
  };

  const handleStartAssessment = () => {
    setShowIntro(false);
    router.push(`/premium/assessment/${slug}`);
  };

  const hasTaken = score !== null && lastTakenDate !== null;
  const daysSinceLast = lastTakenDate
    ? differenceInDays(new Date(), new Date(lastTakenDate))
    : null;

  const needsRetake = daysSinceLast !== null && daysSinceLast > 30;
  const roundedScore = score !== null ? Math.floor(score * 2) / 2 : null;

  // Get status and color based on assessment state
  const getStatusInfo = () => {
    if (!hasTaken) {
      return {
        status: "Not Started",
        color: "gray",
        icon: FaPlay,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-600"
      };
    }
    
    if (needsRetake) {
      return {
        status: "Needs Update",
        color: "yellow",
        icon: FaExclamationTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700"
      };
    }
    
    return {
      status: "Completed",
      color: "green",
      icon: FaCheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
              <StatusIcon className="text-xs" />
              <span>{statusInfo.status}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!hasTaken && (
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaPlay className="text-sm" />
              <span>Start Assessment</span>
            </motion.button>
          )}

          {hasTaken && !needsRetake && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-4">
                  <FaCheckCircle className="text-green-600 text-sm" />
                  <span className="text-green-700 text-sm font-semibold">Assessment Complete</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Your Score:</span>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {roundedScore?.toFixed(1)}
                  </div>
                  <span className="text-sm text-gray-500">out of 5.0</span>
                </div>
                
                <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          )}

          {hasTaken && needsRetake && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200 mb-4">
                  <FaExclamationTriangle className="text-yellow-600 text-sm" />
                  <span className="text-yellow-700 text-sm font-semibold">Update Recommended</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Previous Score:</span>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {roundedScore?.toFixed(1)}
                  </div>
                  <span className="text-sm text-gray-500">out of 5.0</span>
                </div>
                
                <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                  Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    Your assessment is over 30 days old. Consider retaking it to reflect recent changes.
                  </p>
                </div>
                
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaPlay className="text-sm" />
                  <span>Retake Assessment</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {slug in slugToAssessmentType && (
        <AssessmentIntroModal
          isOpen={showIntro}
          onClose={handleClose}
          onStart={handleStartAssessment}
          assessmentType={slugToAssessmentType[slug]}
        />
      )}
    </>
  );
}
