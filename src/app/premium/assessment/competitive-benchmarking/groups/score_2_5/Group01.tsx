"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitive_research_cycle"] === "string" &&
    typeof answers["swot_process"] === "string" &&
    typeof answers["benchmarking_frequency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: competitive_research_cycle */}
      <MultipleChoiceQuestion
        question="How frequently does your company update its competitive research?"
        options={[
          { value: "never", label: "We never formally update it" },
          { value: "yearly", label: "Once a year" },
          { value: "quarterly", label: "Quarterly or around key launches" },
          { value: "continuous", label: "It’s a continuous process" },
        ]}
        value={getStringAnswer(answers["competitive_research_cycle"])}
        onChange={(val) => onAnswer("competitive_research_cycle", val)}
      />

      {/* Question 2: swot_process */}
      <MultipleChoiceQuestion
        question="Do you have a formal process for analyzing competitor strengths and weaknesses?"
        options={[
          { value: "no_process", label: "No process — it’s informal" },
          { value: "occasional_analysis", label: "Occasional SWOT exercises" },
          { value: "structured_analysis", label: "Structured internal analysis" },
          { value: "comprehensive_review", label: "Comprehensive review across teams" },
        ]}
        value={getStringAnswer(answers["swot_process"])}
        onChange={(val) => onAnswer("swot_process", val)}
      />

      {/* Question 3: benchmarking_frequency */}
      <MultipleChoiceQuestion
        question="How often do you benchmark your performance against key competitors?"
        options={[
          { value: "never", label: "Never or rarely" },
          { value: "sporadically", label: "Sporadically for campaigns or launches" },
          { value: "regular_basis", label: "On a regular basis across metrics" },
          { value: "integrated", label: "Integrated into quarterly/annual reviews" },
        ]}
        value={getStringAnswer(answers["benchmarking_frequency"])}
        onChange={(val) => onAnswer("benchmarking_frequency", val)}
      />
    </div>
  );
}
