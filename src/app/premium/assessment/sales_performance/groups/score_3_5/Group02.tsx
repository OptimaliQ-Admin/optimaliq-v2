"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
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

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Process Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your process maturity?"
        options={[
          { value: "traditional", label: "Traditional process" },
          { value: "improved", label: "Improved process" },
          { value: "advanced", label: "Advanced process" },
          { value: "mature", label: "Mature process" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Technology Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your technology maturity?"
        options={[
          { value: "conventional", label: "Conventional technology" },
          { value: "modern", label: "Modern technology" },
          { value: "advanced", label: "Advanced technology" },
          { value: "mature", label: "Mature technology" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Data Maturity */}
      <MultipleChoiceQuestion
        question="How would you rate your data maturity?"
        options={[
          { value: "basic", label: "Basic data usage" },
          { value: "advanced", label: "Advanced data usage" },
          { value: "predictive", label: "Predictive analytics" },
          { value: "mature", label: "Mature data usage" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
