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

// Icon mapping for each assessment type
const assessmentIcons: Record<string, string> = {
  bpm: "⚙️",
  sales: "💰",
  tech_stack: "💻",
  strategic_maturity: "🎯",
  marketing_effectiveness: "📢",
  ai_readiness: "🤖",
  competitive_benchmarking: "📊",
  customer_experience: "👥",
  digital_transformation: "🚀",
  leadership: "👑",
  reassessment: "📈",
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
  const assessmentIcon = assessmentIcons[slug] || "📊";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
      >
        <div className="mb-4">
          <SectionTitleBar title={`${assessmentIcon} ${title}`} />
          <p className="text-gray-500 text-sm leading-relaxed mt-2">
            {description}
          </p>
        </div>

        {!hasTaken && (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-400 mb-2">--</div>
              <div className="text-sm text-gray-600 font-medium">No Score Yet</div>
            </div>
            
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaPlay className="text-sm" />
              <span>Start Assessment</span>
            </motion.button>
          </div>
        )}

        {hasTaken && !needsRetake && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{roundedScore?.toFixed(1)}</div>
              <div className="text-sm text-gray-600 font-medium">Score</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                  Completed
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Taken:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {format(new Date(lastTakenDate!), "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days Since:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {daysSinceLast} days
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm font-medium">
                Assessment completed recently. You can retake this assessment after 30 days to track your progress.
              </p>
            </div>
          </div>
        )}

        {hasTaken && needsRetake && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{roundedScore?.toFixed(1)}</div>
              <div className="text-sm text-gray-600 font-medium">Previous Score</div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                  Needs Update
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Taken:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {format(new Date(lastTakenDate!), "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days Since:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {daysSinceLast} days
                </span>
              </div>
            </div>
            
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
        )}
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
