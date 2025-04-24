"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["campaign_prioritization"] === "string" &&
    typeof answers["marketing_consistency"] === "string" &&
    typeof answers["defined_messaging"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: campaign_prioritization */}
      <MultipleChoiceQuestion
        question="How do you decide which marketing campaigns or channels to prioritize?"
        options={[
          { value: "Based on gut instinct or urgency", label: "Based on gut instinct or urgency" },
          { value: "Based on past experience or leader input", label: "Based on past experience or leader input" },
          { value: "We look at available data and goals", label: "We look at available data and goals" },
          { value: "We follow a strategic roadmap or calendar", label: "We follow a strategic roadmap or calendar" },
        ]}
        value={getStringAnswer(answers["campaign_prioritization"])}
        onChange={(val) => onAnswer("campaign_prioritization", val)}
      />

      {/* Question 2: marketing_consistency */}
      <MultipleChoiceQuestion
        question="How consistent are your marketing efforts across time and channels?"
        options={[
          { value: "Very inconsistent", label: "Very inconsistent" },
          { value: "We have occasional bursts of effort", label: "We have occasional bursts of effort" },
          { value: "Some consistency, especially in 1–2 channels", label: "Some consistency, especially in 1–2 channels" },
          { value: "Consistent multi-channel efforts", label: "Consistent multi-channel efforts" },
        ]}
        value={getStringAnswer(answers["marketing_consistency"])}
        onChange={(val) => onAnswer("marketing_consistency", val)}
      />

      {/* Question 3: defined_messaging */}
      <MultipleChoiceQuestion
        question="Do you have defined messaging or positioning to use in your campaigns?"
        options={[
          { value: "Not yet — it changes often", label: "Not yet — it changes often" },
          { value: "We have a general idea but it's not documented", label: "We have a general idea but it's not documented" },
          { value: "It’s documented but not consistently used", label: "It’s documented but not consistently used" },
          { value: "Yes — we have clear messaging used across channels", label: "Yes — we have clear messaging used across channels" },
        ]}
        value={getStringAnswer(answers["defined_messaging"])}
        onChange={(val) => onAnswer("defined_messaging", val)}
      />
    </div>
  );
}
