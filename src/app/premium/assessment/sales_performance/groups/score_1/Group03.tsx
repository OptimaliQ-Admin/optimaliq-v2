"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
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

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Customer Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your customer understanding?"
        options={[
          { value: "basic", label: "Basic customer service" },
          { value: "developing", label: "Developing customer service" },
          { value: "good", label: "Good customer service" },
          { value: "advanced", label: "Advanced customer service" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Team Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your team understanding?"
        options={[
          { value: "developing", label: "Developing team" },
          { value: "skilled", label: "Skilled team" },
          { value: "high_performing", label: "High-performing team" },
          { value: "advanced", label: "Advanced team" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Growth Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your growth understanding?"
        options={[
          { value: "steady", label: "Steady growth" },
          { value: "developing", label: "Developing growth" },
          { value: "accelerated", label: "Accelerated growth" },
          { value: "advanced", label: "Advanced growth" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
