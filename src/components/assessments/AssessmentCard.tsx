"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import AssessmentIntroModal, {
  AssessmentType,
} from "./AssessmentIntroModal"; 
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <SectionTitleBar title={title} />
        <p className="text-gray-600 mb-4">{description}</p>

        {!hasTaken && (
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Start Assessment
          </button>
        )}

        {hasTaken && !needsRetake && (
          <>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Score:</span>
              <span className="ml-2 text-3xl font-bold text-blue-600">
                {roundedScore?.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
            </p>
          </>
        )}

        {hasTaken && needsRetake && (
          <>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Score:</span>
              <span className="ml-2 text-3xl font-bold text-blue-600">
                {roundedScore?.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
            </p>
            <div className="mt-4 border-t pt-4">
              <p className="text-yellow-700 mb-2">
                Your last assessment is over 30 days old. Consider retaking it
                to reflect recent changes.
              </p>
              <button
                onClick={handleClick}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Retake Assessment
              </button>
            </div>
          </>
        )}
      </div>

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
