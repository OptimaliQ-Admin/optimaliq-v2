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
        className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between group"
      >
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{assessmentIcon}</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{title}</h3>
          </div>
          <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3" />
          <p className="text-gray-500 text-base leading-relaxed">{description}</p>
        </div>

        {!hasTaken && (
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <div className="text-5xl font-extrabold text-gray-300 mb-2 tracking-tight">--</div>
              <div className="text-base text-gray-500 font-medium">No Score Yet</div>
            </div>
            
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-base font-semibold shadow-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaPlay className="text-base" />
              <span>Start Assessment</span>
            </motion.button>
          </div>
        )}

        {hasTaken && !needsRetake && (
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="text-5xl font-extrabold text-blue-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
              <div className="text-base text-gray-500 font-medium">Score</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status:</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 shadow-sm">Completed</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Taken:</span>
                <span className="text-sm font-semibold text-gray-800">{format(new Date(lastTakenDate!), "MMM d, yyyy")}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Days Since:</span>
                <span className="text-sm font-semibold text-gray-800">{daysSinceLast} days</span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <p className="text-green-800 text-xs font-medium">
                Assessment completed recently. You can retake this assessment after 30 days to track your progress.
              </p>
            </div>
          </div>
        )}

        {hasTaken && needsRetake && (
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="text-5xl font-extrabold text-yellow-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
              <div className="text-base text-gray-500 font-medium">Previous Score</div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status:</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">Needs Update</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Taken:</span>
                <span className="text-sm font-semibold text-gray-800">{format(new Date(lastTakenDate!), "MMM d, yyyy")}</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-yellow-800 text-xs font-medium">
                It&apos;s been over 30 days since your last assessment. Retake now to keep your progress up to date.
              </p>
            </div>
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-lg text-base font-semibold shadow-sm hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-2"
            >
              <FaPlay className="text-base" />
              <span>Retake Assessment</span>
            </motion.button>
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-6 flex justify-end">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.textColor}`}>
            <StatusIcon className="text-base" />
            {statusInfo.status}
          </span>
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
