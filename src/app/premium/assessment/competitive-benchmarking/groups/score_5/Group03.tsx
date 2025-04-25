"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmarking_culture"] === "string" &&
    typeof answers["benchmarking_strategic_impact"] === "string" &&
    typeof answers["competitive_edge_confidence"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: benchmarking_culture */}
      <MultipleChoiceQuestion
        question="How would you describe your company’s culture around competitive awareness?"
        options={[
          { value: "not_discussed", label: "It’s rarely discussed or prioritized" },
          { value: "informal", label: "Some informal tracking, not consistent" },
          { value: "embedded", label: "Embedded in product, sales, and marketing discussions" },
          { value: "strategic_norm", label: "A strategic norm that shapes decisions company-wide" },
        ]}
        value={getStringAnswer(answers["benchmarking_culture"])}
        onChange={(val) => onAnswer("benchmarking_culture", val)}
      />

      {/* Question 9: benchmarking_strategic_impact */}
      <MultipleChoiceQuestion
        question="How does competitive benchmarking influence strategic planning?"
        options={[
          { value: "no_influence", label: "It doesn’t really influence strategy" },
          { value: "some_influence", label: "It’s used occasionally" },
          { value: "influential", label: "It helps prioritize or shape key decisions" },
          { value: "core_to_strategy", label: "It’s a core input to annual and quarterly planning" },
        ]}
        value={getStringAnswer(answers["benchmarking_strategic_impact"])}
        onChange={(val) => onAnswer("benchmarking_strategic_impact", val)}
      />

      {/* Question 10: competitive_edge_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your business has a measurable competitive edge?"
        options={[
          { value: "not_confident", label: "Not confident — we don’t know where we stand" },
          { value: "somewhat_confident", label: "Somewhat — we have a few strengths" },
          { value: "mostly_confident", label: "Mostly — we know our unique differentiators" },
          { value: "fully_confident", label: "Fully — we have clear and defensible advantages" },
        ]}
        value={getStringAnswer(answers["competitive_edge_confidence"])}
        onChange={(val) => onAnswer("competitive_edge_confidence", val)}
      />
    </div>
  );
}
