"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
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

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Process Foundation */}
      <MultipleChoiceQuestion
        question="How would you rate your process foundation?"
        options={[
          { value: "traditional", label: "Traditional process" },
          { value: "developing", label: "Developing process" },
          { value: "improved", label: "Improved process" },
          { value: "advanced", label: "Advanced process" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Technology Foundation */}
      <MultipleChoiceQuestion
        question="How would you rate your technology foundation?"
        options={[
          { value: "conventional", label: "Conventional technology" },
          { value: "developing", label: "Developing technology" },
          { value: "modern", label: "Modern technology" },
          { value: "advanced", label: "Advanced technology" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Data Foundation */}
      <MultipleChoiceQuestion
        question="How would you rate your data foundation?"
        options={[
          { value: "basic", label: "Basic data usage" },
          { value: "developing", label: "Developing data usage" },
          { value: "advanced", label: "Advanced data usage" },
          { value: "predictive", label: "Predictive analytics" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
