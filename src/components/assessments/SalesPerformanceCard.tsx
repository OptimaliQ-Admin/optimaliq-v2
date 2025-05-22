// src/components/assessments/SalesPerformanceCard.tsx
"use client";

import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import AssessmentIntroModal from "./AssessmentIntroModal";

const salesDescriptions: Record<number, string> = {
  1: "Sales efforts are reactive with minimal structure. Establishing clear pipeline stages and priorities is key.",
  1.5: "Some sales structure exists, but processes are still inconsistent.",
  2: "You've begun formalizing your pipeline, but deal tracking and follow-ups need work.",
  2.5: "Progress made—your sales workflow is evolving but lacks full consistency.",
  3: "Sales systems are mostly reliable; now focus on refining data accuracy and team alignment.",
  3.5: "Strong pipeline hygiene and rhythm. You're close to a high-performing sales engine.",
  4: "Well-defined, consistent, and effective sales process. Time to scale and optimize further.",
  4.5: "Advanced sales operations. Focus now on predictive insights and automation.",
  5: "World-class sales performance. You're ready to lead in forecasting, conversion, and sales enablement."
};

type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};

export default function SalesPerformanceCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  const handleStart = () => setShowIntro(true);

  const daysSinceLast = lastTakenDate
    ? differenceInDays(new Date(), new Date(lastTakenDate))
    : null;

  const roundedScore = score !== null ? Math.floor(score * 2) / 2 : null;
  const needsRetake = daysSinceLast !== null && daysSinceLast > 30;
  const hasTaken = score !== null && lastTakenDate !== null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 transition hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">📈 Sales Performance Assessment</h2>

        {!hasTaken && (
          <>
            <p className="text-gray-600">
              Evaluate the health of your sales pipeline, deal velocity, and opportunity management.
            </p>
            <button
              onClick={handleStart}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Assessment
            </button>
          </>
        )}

        {hasTaken && (
          <>
            <div className="text-3xl font-bold text-blue-700">Score = {roundedScore}</div>
            <p className="text-gray-600">{salesDescriptions[roundedScore ?? 1]}</p>
            <p className="text-sm text-gray-500">
              Last taken on {format(new Date(lastTakenDate!), "MMMM d, yyyy")}
            </p>

            {needsRetake && (
              <div className="mt-4 border-t pt-4">
                <p className="text-yellow-700 mb-2">
                  Your last assessment is over 30 days old. Consider retaking it to reflect recent changes.
                </p>
                <button
                  onClick={handleStart}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Retake Assessment
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showIntro && (
        <AssessmentIntroModal
          isOpen={showIntro}
          onClose={() => setShowIntro(false)}
          onStart={() => {
            setShowIntro(false);
            router.push("/premium/assessment/sales_performance");
          }}
          assessmentType="sales"
        />
      )}
    </>
  );
}
