"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["industry_benchmark_usage"] === "string" &&
    typeof answers["market_awareness_level"] === "string" &&
    typeof answers["benchmarking_tools_usage"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_1_9_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: industry_benchmark_usage */}
      <MultipleChoiceQuestion
        question="How often do you review or use industry benchmarks?"
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely — only when prompted" },
          { value: "sometimes", label: "Sometimes during planning cycles" },
          { value: "regularly", label: "Regularly — it’s part of strategy" },
        ]}
        value={getStringAnswer(answers["industry_benchmark_usage"])}
        onChange={(val) => onAnswer("industry_benchmark_usage", val)}
      />

      {/* Question 9: market_awareness_level */}
      <MultipleChoiceQuestion
        question="How would you rate your company’s overall market awareness?"
        options={[
          { value: "very_low", label: "Very low — we don’t track it" },
          { value: "limited", label: "Limited — some idea but not detailed" },
          { value: "solid", label: "Solid — we understand our space well" },
          { value: "leading", label: "Leading — we set trends others follow" },
        ]}
        value={getStringAnswer(answers["market_awareness_level"])}
        onChange={(val) => onAnswer("market_awareness_level", val)}
      />

      {/* Question 10: benchmarking_tools_usage */}
      <MultipleChoiceQuestion
        question="Do you use any tools or platforms to track competitor benchmarks?"
        options={[
          { value: "none", label: "None currently" },
          { value: "manual_tracking", label: "We do it manually with spreadsheets or Google" },
          { value: "some_tools", label: "We use some tools occasionally (e.g. SEMrush, SimilarWeb)" },
          { value: "dedicated_platform", label: "We have dedicated benchmarking tools or dashboards" },
        ]}
        value={getStringAnswer(answers["benchmarking_tools_usage"])}
        onChange={(val) => onAnswer("benchmarking_tools_usage", val)}
      />
    </div>
  );
}
