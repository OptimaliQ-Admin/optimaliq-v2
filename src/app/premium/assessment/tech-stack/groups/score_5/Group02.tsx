"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["autonomous_operations"] === "string" &&
    typeof answers["self_optimization"] === "string" &&
    typeof answers["continuous_improvement"] === "string"
  );
}

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you implement autonomous operations?"
        options={[
          { value: "manual", label: "Manual — human-operated" },
          { value: "automated", label: "Automated — scripted operations" },
          { value: "intelligent", label: "Intelligent — AI-driven operations" },
          { value: "autonomous", label: "Autonomous — self-operating systems" },
        ]}
        value={getStringAnswer(answers["autonomous_operations"])}
        onChange={(val) => onAnswer("autonomous_operations", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement self-optimization?"
        options={[
          { value: "manual", label: "Manual — human optimization" },
          { value: "automated", label: "Automated — rule-based optimization" },
          { value: "intelligent", label: "Intelligent — AI-based optimization" },
          { value: "autonomous", label: "Autonomous — self-optimizing systems" },
        ]}
        value={getStringAnswer(answers["self_optimization"])}
        onChange={(val) => onAnswer("self_optimization", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement continuous improvement?"
        options={[
          { value: "manual", label: "Manual — periodic reviews" },
          { value: "automated", label: "Automated — scheduled improvements" },
          { value: "intelligent", label: "Intelligent — AI-driven improvements" },
          { value: "autonomous", label: "Autonomous — self-improving systems" },
        ]}
        value={getStringAnswer(answers["continuous_improvement"])}
        onChange={(val) => onAnswer("continuous_improvement", val)}
      />
    </div>
  );
} 