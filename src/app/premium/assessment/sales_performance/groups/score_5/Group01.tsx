"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
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

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Strategy Leadership */}
      <MultipleChoiceQuestion
        question="How would you rate your strategy leadership?"
        options={[
          { value: "developing", label: "Developing leadership" },
          { value: "good", label: "Good leadership" },
          { value: "excellent", label: "Excellent leadership" },
          { value: "world_class", label: "World-class leadership" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Innovation Leadership */}
      <MultipleChoiceQuestion
        question="How would you rate your innovation leadership?"
        options={[
          { value: "developing", label: "Developing leadership" },
          { value: "good", label: "Good leadership" },
          { value: "excellent", label: "Excellent leadership" },
          { value: "world_class", label: "World-class leadership" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Market Leadership */}
      <MultipleChoiceQuestion
        question="How would you rate your market leadership?"
        options={[
          { value: "developing", label: "Developing leadership" },
          { value: "good", label: "Good leadership" },
          { value: "excellent", label: "Excellent leadership" },
          { value: "world_class", label: "World-class leadership" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
