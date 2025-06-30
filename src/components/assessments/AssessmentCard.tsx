"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import AssessmentIntroModal, {
  AssessmentType,
} from "./AssessmentIntroModal"; 
import { FaChartLine, FaCheckCircle, FaExclamationTriangle, FaPlay, FaArrowRight, FaClock, FaTrophy } from "react-icons/fa";

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

// Enhanced icon mapping for each assessment type
const assessmentIcons: Record<string, { icon: string; color: string; bgColor: string }> = {
  bpm: { icon: "⚙️", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
  sales: { icon: "💰", color: "from-green-500 to-green-600", bgColor: "bg-green-50" },
  tech_stack: { icon: "💻", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
  strategic_maturity: { icon: "🎯", color: "from-indigo-500 to-indigo-600", bgColor: "bg-indigo-50" },
  marketing_effectiveness: { icon: "📢", color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50" },
  ai_readiness: { icon: "🤖", color: "from-cyan-500 to-cyan-600", bgColor: "bg-cyan-50" },
  competitive_benchmarking: { icon: "📊", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50" },
  customer_experience: { icon: "👥", color: "from-teal-500 to-teal-600", bgColor: "bg-teal-50" },
  digital_transformation: { icon: "🚀", color: "from-red-500 to-red-600", bgColor: "bg-red-50" },
  leadership: { icon: "👑", color: "from-yellow-500 to-yellow-600", bgColor: "bg-yellow-50" },
  reassessment: { icon: "📈", color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50" },
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
        textColor: "text-gray-600",
        buttonColor: "from-blue-500 to-indigo-600",
        buttonHover: "from-blue-600 to-indigo-700"
      };
    }
    
    if (needsRetake) {
      return {
        status: "Needs Update",
        color: "yellow",
        icon: FaExclamationTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
        buttonColor: "from-yellow-500 to-yellow-600",
        buttonHover: "from-yellow-600 to-yellow-700"
      };
    }
    
    return {
      status: "Completed",
      color: "green",
      icon: FaCheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      buttonColor: "from-green-500 to-green-600",
      buttonHover: "from-green-600 to-green-700"
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const assessmentIcon = assessmentIcons[slug] || { icon: "📊", color: "from-gray-500 to-gray-600", bgColor: "bg-gray-50" };

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
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${assessmentIcon.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <span className="text-2xl">{assessmentIcon.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 mb-1">
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-8 bg-gradient-to-r ${assessmentIcon.color} rounded-full`} />
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${assessmentIcon.bgColor} ${assessmentIcon.color.replace('from-', 'text-').replace(' to-', '')}`}>
                    {assessmentIcon.icon} Assessment
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border shadow-sm ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.textColor}`}>
              <StatusIcon className="text-sm" />
              {statusInfo.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-8">{description}</p>

          {/* Content based on status */}
          {!hasTaken && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FaChartLine className="text-gray-400 text-3xl" />
                </div>
                <div className="text-3xl font-extrabold text-gray-300 mb-2 tracking-tight">--</div>
                <div className="text-sm text-gray-500 font-medium">No Score Yet</div>
              </div>
              
              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
              >
                <FaPlay className="text-sm" />
                <span>Start Assessment</span>
                <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          )}

          {hasTaken && !needsRetake && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FaTrophy className="text-green-500 text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-green-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-medium">Current Score</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Taken:</span>
                    <span className="text-sm font-semibold text-gray-800">{format(new Date(lastTakenDate!), "MMM d, yyyy")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Since:</span>
                    <span className="text-sm font-semibold text-gray-800">{daysSinceLast} days</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-green-800 text-xs font-medium flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    Assessment completed recently. You can retake after 30 days to track progress.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasTaken && needsRetake && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FaClock className="text-yellow-500 text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-white text-sm" />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-yellow-600 mb-2 tracking-tight drop-shadow-sm">{roundedScore?.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-medium">Previous Score</div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Taken:</span>
                    <span className="text-sm font-semibold text-gray-800">{format(new Date(lastTakenDate!), "MMM d, yyyy")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Since:</span>
                    <span className="text-sm font-semibold text-gray-800">{daysSinceLast} days</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-yellow-200">
                  <p className="text-yellow-800 text-xs font-medium flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-600" />
                    It&apos;s been over 30 days. Retake now to keep your progress up to date.
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
              >
                <FaPlay className="text-sm" />
                <span>Retake Assessment</span>
                <FaArrowRight className="text-sm" />
              </motion.button>
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
