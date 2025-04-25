"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["market_share_tracking"] === "string" &&
    typeof answers["competitive_visibility"] === "string" &&
    typeof answers["benchmark_frequency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: market_share_tracking */}
      <MultipleChoiceQuestion
        question="How do you track your market share or category position?"
        options={[
          { value: "we_dont_track", label: "We don’t track it at all" },
          { value: "rough_estimate", label: "We use rough estimates or assumptions" },
          { value: "informal_metrics", label: "We use informal metrics or sales trends" },
          { value: "formal_analysis", label: "We use formal competitive research or analytics" },
        ]}
        value={getStringAnswer(answers["market_share_tracking"])}
        onChange={(val) => onAnswer("market_share_tracking", val)}
      />

      {/* Question 2: competitive_visibility */}
      <MultipleChoiceQuestion
        question="How clearly do you understand how your performance compares to competitors?"
        options={[
          { value: "no_clarity", label: "We have no clear sense of this" },
          { value: "some_clarity", label: "We have some clarity based on anecdotal info" },
          { value: "moderate_visibility", label: "We have moderate visibility into competitor performance" },
          { value: "high_visibility", label: "We have high visibility via benchmarking or analyst data" },
        ]}
        value={getStringAnswer(answers["competitive_visibility"])}
        onChange={(val) => onAnswer("competitive_visibility", val)}
      />

      {/* Question 3: benchmark_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you benchmark your performance against competitors?"
        options={[
          { value: "never", label: "Never" },
          { value: "annually", label: "Once a year" },
          { value: "quarterly", label: "Quarterly" },
          { value: "monthly", label: "Monthly or more frequently" },
        ]}
        value={getStringAnswer(answers["benchmark_frequency"])}
        onChange={(val) => onAnswer("benchmark_frequency", val)}
      />
    </div>
  );
}
