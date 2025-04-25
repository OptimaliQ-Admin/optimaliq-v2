"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_acquisition_cost"] === "string" &&
    answers["customer_acquisition_cost"].trim().length > 0 &&
    typeof answers["marketing_challenge"] === "string" &&
    answers["marketing_challenge"].trim().length > 0 &&
    typeof answers["marketing_improvement"] === "string" &&
    answers["marketing_improvement"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: customer_acquisition_cost */}
      <MultipleChoiceQuestion
        question="Do you know how much it costs to acquire a new customer (CAC)?"
        options={[
          { value: "No idea", label: "No idea" },
          { value: "We have a rough estimate", label: "We have a rough estimate" },
          { value: "Yes, but not sure it’s accurate", label: "Yes, but not sure it’s accurate" },
          { value: "Yes, we track CAC regularly", label: "Yes, we track CAC regularly" },
        ]}
        value={getStringAnswer(answers["customer_acquisition_cost"])}
        onChange={(val) => onAnswer("customer_acquisition_cost", val)}
      />

      {/* Question 9: marketing_challenge */}
      <TextAreaQuestion
        question="What’s the biggest challenge you face with marketing right now?"
        placeholder="E.g., generating leads, measuring performance, content creation..."
        value={getStringAnswer(answers["marketing_challenge"])}
        onChange={(val) => onAnswer("marketing_challenge", val)}
        maxLength={300}
      />

      {/* Question 10: marketing_improvement */}
      <TextAreaQuestion
        question="If you could improve one part of your marketing in the next 30 days, what would it be?"
        placeholder="E.g., ad performance, customer targeting, campaign frequency..."
        value={getStringAnswer(answers["marketing_improvement"])}
        onChange={(val) => onAnswer("marketing_improvement", val)}
        maxLength={300}
      />
    </div>
  );
}
