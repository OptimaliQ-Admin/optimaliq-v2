"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["innovation_platform"] === "string" &&
    typeof answers["emerging_tech"] === "string" &&
    typeof answers["research_dev"] === "string"
  );
}

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you support innovation?"
        options={[
          { value: "basic", label: "Basic — standard R&D" },
          { value: "advanced", label: "Advanced — innovation labs" },
          { value: "sophisticated", label: "Sophisticated — innovation centers" },
          { value: "cutting_edge", label: "Cutting-edge — innovation ecosystem" },
        ]}
        value={getStringAnswer(answers["innovation_platform"])}
        onChange={(val) => onAnswer("innovation_platform", val)}
      />

      <MultipleChoiceQuestion
        question="How do you adopt emerging technologies?"
        options={[
          { value: "reactive", label: "Reactive — following trends" },
          { value: "proactive", label: "Proactive — early adoption" },
          { value: "innovative", label: "Innovative — technology leadership" },
          { value: "disruptive", label: "Disruptive — technology creation" },
        ]}
        value={getStringAnswer(answers["emerging_tech"])}
        onChange={(val) => onAnswer("emerging_tech", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach research and development?"
        options={[
          { value: "basic", label: "Basic — incremental improvements" },
          { value: "advanced", label: "Advanced — breakthrough research" },
          { value: "sophisticated", label: "Sophisticated — disruptive innovation" },
          { value: "cutting_edge", label: "Cutting-edge — paradigm shifts" },
        ]}
        value={getStringAnswer(answers["research_dev"])}
        onChange={(val) => onAnswer("research_dev", val)}
      />
    </div>
  );
} 