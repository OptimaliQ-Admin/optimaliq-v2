"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["what_89a231"] === "string" &&
    answers["what_89a231"].trim().length > 0 &&
    typeof answers["what_3164b1"] === "string" &&
    answers["what_3164b1"].trim().length > 0 &&
    typeof answers["what_7f9c2d"] === "string" &&
    answers["what_7f9c2d"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Strategy Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your strategy maturity?"
        options={[
          { value: "developing", label: "Developing strategy" },
          { value: "established", label: "Established strategy" },
          { value: "advanced", label: "Advanced strategy" },
          { value: "mature", label: "Mature strategy" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Innovation Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your innovation maturity?"
        options={[
          { value: "basic", label: "Basic innovation" },
          { value: "good", label: "Good innovation" },
          { value: "advanced", label: "Advanced innovation" },
          { value: "mature", label: "Mature innovation" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Market Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your market maturity?"
        options={[
          { value: "follower", label: "Market follower" },
          { value: "challenger", label: "Market challenger" },
          { value: "leader", label: "Market leader" },
          { value: "mature", label: "Market mature" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
