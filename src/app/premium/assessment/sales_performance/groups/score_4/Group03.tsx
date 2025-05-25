"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
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

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Customer Excellence */}
      <MultipleChoiceQuestion
        question="How would you rate your customer excellence?"
        options={[
          { value: "developing", label: "Developing service" },
          { value: "good", label: "Good service" },
          { value: "excellent", label: "Excellent service" },
          { value: "world_class", label: "World-class service" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Team Excellence */}
      <MultipleChoiceQuestion
        question="How would you rate your team excellence?"
        options={[
          { value: "developing", label: "Developing team" },
          { value: "good", label: "Good team" },
          { value: "excellent", label: "Excellent team" },
          { value: "world_class", label: "World-class team" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Growth Excellence */}
      <MultipleChoiceQuestion
        question="How would you rate your growth excellence?"
        options={[
          { value: "developing", label: "Developing growth" },
          { value: "good", label: "Good growth" },
          { value: "excellent", label: "Excellent growth" },
          { value: "world_class", label: "World-class growth" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
