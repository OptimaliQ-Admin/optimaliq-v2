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

export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["future_readiness"] === "string" &&
    typeof answers["tech_strategy"] === "string" &&
    typeof answers["innovation_culture"] === "string"
  );
}

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you prepare for future technologies?"
        options={[
          { value: "reactive", label: "Reactive — responding to change" },
          { value: "proactive", label: "Proactive — anticipating change" },
          { value: "strategic", label: "Strategic — driving change" },
          { value: "visionary", label: "Visionary — creating change" },
        ]}
        value={getStringAnswer(answers["future_readiness"])}
        onChange={(val) => onAnswer("future_readiness", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach technology strategy?"
        options={[
          { value: "tactical", label: "Tactical — short-term focus" },
          { value: "strategic", label: "Strategic — medium-term focus" },
          { value: "transformative", label: "Transformative — long-term focus" },
          { value: "visionary", label: "Visionary — future focus" },
        ]}
        value={getStringAnswer(answers["tech_strategy"])}
        onChange={(val) => onAnswer("tech_strategy", val)}
      />

      <MultipleChoiceQuestion
        question="How do you foster innovation culture?"
        options={[
          { value: "basic", label: "Basic — encouraging innovation" },
          { value: "advanced", label: "Advanced — supporting innovation" },
          { value: "sophisticated", label: "Sophisticated — driving innovation" },
          { value: "cutting_edge", label: "Cutting-edge — living innovation" },
        ]}
        value={getStringAnswer(answers["innovation_culture"])}
        onChange={(val) => onAnswer("innovation_culture", val)}
      />
    </div>
  );
} 