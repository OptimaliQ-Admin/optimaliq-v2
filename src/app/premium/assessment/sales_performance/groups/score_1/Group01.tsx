"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";

export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
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

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Strategy Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your strategy understanding?"
        options={[
          { value: "basic", label: "Basic understanding" },
          { value: "developing", label: "Developing understanding" },
          { value: "established", label: "Established understanding" },
          { value: "advanced", label: "Advanced understanding" },
        ]}
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
      />

      {/* Question 2: Innovation Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your innovation understanding?"
        options={[
          { value: "basic", label: "Basic innovation" },
          { value: "developing", label: "Developing innovation" },
          { value: "good", label: "Good innovation" },
          { value: "advanced", label: "Advanced innovation" },
        ]}
        value={getStringAnswer(answers["what_3164b1"])}
        onChange={(val) => onAnswer("what_3164b1", val)}
      />

      {/* Question 3: Market Understanding */}
      <MultipleChoiceQuestion
        question="How would you rate your market understanding?"
        options={[
          { value: "follower", label: "Market follower" },
          { value: "developing", label: "Developing presence" },
          { value: "challenger", label: "Market challenger" },
          { value: "leader", label: "Market leader" },
        ]}
        value={getStringAnswer(answers["what_7f9c2d"])}
        onChange={(val) => onAnswer("what_7f9c2d", val)}
      />
    </div>
  );
}
