"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmarking_process"] === "string" &&
    typeof answers["market_data_frequency"] === "string" &&
    typeof answers["competitor_review_depth"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="Do you have a structured process for benchmarking your performance against others?"
        options={[
          { value: "no_process", label: "No — it's mostly ad hoc or informal" },
          { value: "basic_tracking", label: "We track some comparisons occasionally" },
          { value: "structured_process", label: "Yes — we have a structured benchmarking process" },
          { value: "integrated_benchmarking", label: "Benchmarking is fully integrated into planning" },
        ]}
        value={getStringAnswer(answers["benchmarking_process"])}
        onChange={(val) => onAnswer("benchmarking_process", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How often do you collect or review external market or competitor data?"
        options={[
          { value: "rarely", label: "Rarely or never" },
          { value: "sometimes", label: "A few times per year" },
          { value: "regularly", label: "Quarterly or monthly" },
          { value: "frequently", label: "Weekly or in real-time" },
        ]}
        value={getStringAnswer(answers["market_data_frequency"])}
        onChange={(val) => onAnswer("market_data_frequency", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="When you review competitor or peer performance, how deep is your analysis?"
        options={[
          { value: "surface_level", label: "Surface-level — we glance at basic metrics" },
          { value: "somewhat_deep", label: "Somewhat — we look at trends and summaries" },
          { value: "in_depth", label: "In-depth — we break down their performance drivers" },
          { value: "comprehensive", label: "Comprehensive — we compare across key dimensions with insights" },
        ]}
        value={getStringAnswer(answers["competitor_review_depth"])}
        onChange={(val) => onAnswer("competitor_review_depth", val)}
      />
    </div>
  );
}
