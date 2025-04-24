"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["digital_strategy"] === "string" &&
    typeof answers["platform_usage"] === "string" &&
    typeof answers["current_limitations"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: digital_strategy */}
      <MultipleChoiceQuestion
        question="Do you have a digital strategy that guides your priorities?"
        options={[
          { value: "no_strategy", label: "No — we act on immediate needs" },
          { value: "informal_strategy", label: "Somewhat — we have informal direction" },
          { value: "partial_strategy", label: "Yes — we’ve defined a few goals or themes" },
          { value: "clear_strategy", label: "Yes — we have a clearly defined strategy" },
        ]}
        value={getStringAnswer(answers["digital_strategy"])}
        onChange={(val) => onAnswer("digital_strategy", val)}
      />

      {/* Question 2: platform_usage */}
      <MultipleChoiceQuestion
        question="How would you describe your use of key platforms (CRM, CMS, ERP, etc.)?"
        options={[
          { value: "minimal_usage", label: "We barely use them" },
          { value: "scattered_usage", label: "We use a few features inconsistently" },
          { value: "core_features", label: "We use the core features effectively" },
          { value: "fully_leveraged", label: "We fully leverage platform capabilities" },
        ]}
        value={getStringAnswer(answers["platform_usage"])}
        onChange={(val) => onAnswer("platform_usage", val)}
      />

      {/* Question 3: current_limitations */}
      <MultipleChoiceQuestion
        question="What limits your ability to deliver on digital initiatives today?"
        options={[
          { value: "tech_issues", label: "Technology limitations or lack of tools" },
          { value: "data_problems", label: "Poor data quality or access" },
          { value: "lack_resources", label: "Lack of people or capacity" },
          { value: "not_prioritized", label: "It’s not prioritized by leadership" },
        ]}
        value={getStringAnswer(answers["current_limitations"])}
        onChange={(val) => onAnswer("current_limitations", val)}
      />
    </div>
  );
}
