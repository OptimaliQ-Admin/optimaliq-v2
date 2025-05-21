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

export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["autonomous_infrastructure"] === "string" &&
    typeof answers["self_learning_systems"] === "string" &&
    typeof answers["adaptive_architecture"] === "string"
  );
}

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you implement autonomous infrastructure?"
        options={[
          { value: "basic", label: "Basic — automated systems" },
          { value: "advanced", label: "Advanced — self-managing systems" },
          { value: "sophisticated", label: "Sophisticated — self-healing systems" },
          { value: "autonomous", label: "Autonomous — self-evolving systems" },
        ]}
        value={getStringAnswer(answers["autonomous_infrastructure"])}
        onChange={(val) => onAnswer("autonomous_infrastructure", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement self-learning systems?"
        options={[
          { value: "basic", label: "Basic — machine learning" },
          { value: "advanced", label: "Advanced — deep learning" },
          { value: "sophisticated", label: "Sophisticated — reinforcement learning" },
          { value: "autonomous", label: "Autonomous — continuous learning" },
        ]}
        value={getStringAnswer(answers["self_learning_systems"])}
        onChange={(val) => onAnswer("self_learning_systems", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement adaptive architecture?"
        options={[
          { value: "static", label: "Static — fixed architecture" },
          { value: "dynamic", label: "Dynamic — flexible architecture" },
          { value: "adaptive", label: "Adaptive — evolving architecture" },
          { value: "autonomous", label: "Autonomous — self-optimizing architecture" },
        ]}
        value={getStringAnswer(answers["adaptive_architecture"])}
        onChange={(val) => onAnswer("adaptive_architecture", val)}
      />
    </div>
  );
} 