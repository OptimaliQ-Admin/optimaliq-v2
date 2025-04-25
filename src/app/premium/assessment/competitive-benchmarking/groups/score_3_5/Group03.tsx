"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitive_positioning_maturity"] === "string" &&
    typeof answers["benchmarking_investment"] === "string" &&
    typeof answers["benchmarking_tools_usage"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: competitive_positioning_maturity */}
      <MultipleChoiceQuestion
        question="How mature is your competitive positioning strategy?"
        options={[
          { value: "no_strategy", label: "We don’t have a formal strategy" },
          { value: "basic_positioning", label: "We rely on basic messaging or pricing" },
          { value: "clear_differentiation", label: "We have clear differentiation and messaging" },
          { value: "proven_positioning", label: "We track and prove differentiation with metrics" },
        ]}
        value={getStringAnswer(answers["competitive_positioning_maturity"])}
        onChange={(val) => onAnswer("competitive_positioning_maturity", val)}
      />

      {/* Question 9: benchmarking_investment */}
      <MultipleChoiceQuestion
        question="How much does your team invest (time or budget) in competitive benchmarking efforts?"
        options={[
          { value: "no_investment", label: "No time or budget is allocated" },
          { value: "minimal_investment", label: "Minimal — a few hours or simple tracking" },
          { value: "moderate_investment", label: "Moderate — we dedicate team time or tools" },
          { value: "significant_investment", label: "Significant — it’s a core part of strategy" },
        ]}
        value={getStringAnswer(answers["benchmarking_investment"])}
        onChange={(val) => onAnswer("benchmarking_investment", val)}
      />

      {/* Question 10: benchmarking_tools_usage */}
      <MultipleChoiceQuestion
        question="Do you use tools or platforms to support competitive or benchmarking analysis?"
        options={[
          { value: "no_tools", label: "No tools currently used" },
          { value: "basic_tools", label: "Basic tools (e.g. spreadsheets, alerts)" },
          { value: "dedicated_tools", label: "Dedicated platforms or databases" },
          { value: "integrated_stack", label: "Tools are integrated into our GTM stack" },
        ]}
        value={getStringAnswer(answers["benchmarking_tools_usage"])}
        onChange={(val) => onAnswer("benchmarking_tools_usage", val)}
      />
    </div>
  );
}
