"use client";


import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import AssessmentIntroModal from "./AssessmentIntroModal";


const LeadershipDescriptions: Record<number, string> = {
  1: "Your business is operating in a very reactive way. There’s a strong need for defined processes.",
  1.5: "Some structure exists, but it's inconsistent and mostly ad hoc.",
  2: "You’re making progress toward defined processes but lack scalability.",
  2.5: "You’ve got some structure, but there’s room to formalize processes further.",
  3: "Your operations are stable and somewhat consistent — keep optimizing.",
  3.5: "You’re approaching operational excellence with scalable workflows.",
  4: "You have strong process maturity — focus now on innovation.",
  4.5: "You’re advanced — lean into automation and continuous improvement.",
  5: "Your BPM capabilities are world-class. Use them to drive competitive advantage."
};


type Props = {
  score: number | null;
  lastTakenDate: string | null;
  userId: string;
};


export default function LeadershipCard({ score, lastTakenDate, userId }: Props) {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);


  const handleStart = () => setShowIntro(true);


  const daysSinceLast = lastTakenDate ? differenceInDays(new Date(), new Date(lastTakenDate)) : null;
  const roundedScore = score !== null ? Math.floor(score * 2) / 2 : null;


  const needsRetake = daysSinceLast !== null && daysSinceLast > 30;
  const hasTaken = score !== null && lastTakenDate !== null;


  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 transition hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">🏢 Leadership & Team Assessment</h2>


        {!hasTaken && (
          <>
            <p className="text-gray-600">
              Assess leadership effectiveness and alignment to improve culture and execution.
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
            <p className="text-gray-600">{LeadershipDescriptions[roundedScore ?? 1]}</p>
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
            router.push("/premium/assessment/leadership-team");
          }}
          assessmentType="leadership"
        />
      )}
    </>
  );
}
