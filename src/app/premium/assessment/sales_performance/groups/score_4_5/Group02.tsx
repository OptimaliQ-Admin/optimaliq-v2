"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
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

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Process Mastery */}
      <MultipleChoiceQuestion
        question="How would you rate your process mastery?"
        options={[
          { value: "developing", label: "Developing mastery" },
          { value: "good", label: "Good mastery" },
          { value: "excellent", label: "Excellent mastery" },
          { value: "world_class", label: "World-class mastery" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Technology Mastery */}
      <MultipleChoiceQuestion
        question="How would you rate your technology mastery?"
        options={[
          { value: "developing", label: "Developing mastery" },
          { value: "good", label: "Good mastery" },
          { value: "excellent", label: "Excellent mastery" },
          { value: "world_class", label: "World-class mastery" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Data Mastery */}
      <MultipleChoiceQuestion
        question="How would you rate your data mastery?"
        options={[
          { value: "developing", label: "Developing mastery" },
          { value: "good", label: "Good mastery" },
          { value: "excellent", label: "Excellent mastery" },
          { value: "world_class", label: "World-class mastery" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
