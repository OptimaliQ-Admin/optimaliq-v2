"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_strategy_alignment"] === "string" &&
    typeof answers["cx_team_model"] === "string" &&
    typeof answers["cx_data_activation"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 1: cx_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your customer experience strategy with your overall business goals?"
        options={[
          { value: "no_alignment", label: "Not aligned — CX is separate from strategy" },
          { value: "some_alignment", label: "Somewhat — CX supports high-level goals" },
          { value: "strong_alignment", label: "Strong — CX initiatives support key priorities" },
          { value: "fully_integrated", label: "Fully aligned — CX is embedded in our strategic roadmap" },
        ]}
        value={getStringAnswer(answers["cx_strategy_alignment"])}
        onChange={(val) => onAnswer("cx_strategy_alignment", val)}
      />

      {/* Question 2: cx_team_model */}
      <MultipleChoiceQuestion
        question="How is your CX team structured?"
        options={[
          { value: "no_dedicated_team", label: "No dedicated CX team" },
          { value: "ad_hoc_roles", label: "Ad hoc or part-time CX ownership" },
          { value: "centralized_team", label: "Centralized CX team with dedicated leads" },
          { value: "distributed_excellence", label: "CX embedded across functions with CoE support" },
        ]}
        value={getStringAnswer(answers["cx_team_model"])}
        onChange={(val) => onAnswer("cx_team_model", val)}
      />

      {/* Question 3: cx_data_activation */}
      <MultipleChoiceQuestion
        question="How do you activate customer data to drive personalized experiences?"
        options={[
          { value: "manual_use", label: "Mostly manual use of customer data" },
          { value: "segment_driven", label: "Segment-driven personalization in campaigns" },
          { value: "dynamic_journeys", label: "Dynamic journeys based on behavior and attributes" },
          { value: "real_time_activation", label: "Real-time, AI-driven personalization at scale" },
        ]}
        value={getStringAnswer(answers["cx_data_activation"])}
        onChange={(val) => onAnswer("cx_data_activation", val)}
      />
    </div>
  );
}
