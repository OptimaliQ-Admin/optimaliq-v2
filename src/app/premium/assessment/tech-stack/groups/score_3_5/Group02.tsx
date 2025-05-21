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

export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_applications"] === "string" &&
    typeof answers["ml_models"] === "string" &&
    typeof answers["ai_governance"] === "string"
  );
}

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you apply AI in your applications?"
        options={[
          { value: "experimental", label: "Experimental — pilot projects" },
          { value: "selective", label: "Selective — specific use cases" },
          { value: "strategic", label: "Strategic — planned AI integration" },
          { value: "pervasive", label: "Pervasive — AI-first approach" },
        ]}
        value={getStringAnswer(answers["ai_applications"])}
        onChange={(val) => onAnswer("ai_applications", val)}
      />

      <MultipleChoiceQuestion
        question="How do you manage ML models?"
        options={[
          { value: "manual", label: "Manual — basic model management" },
          { value: "automated", label: "Automated — model lifecycle" },
          { value: "integrated", label: "Integrated — model operations" },
          { value: "advanced", label: "Advanced — MLOps platform" },
        ]}
        value={getStringAnswer(answers["ml_models"])}
        onChange={(val) => onAnswer("ml_models", val)}
      />

      <MultipleChoiceQuestion
        question="How do you govern AI/ML systems?"
        options={[
          { value: "basic", label: "Basic — essential controls" },
          { value: "standard", label: "Standard — documented policies" },
          { value: "comprehensive", label: "Comprehensive — full governance" },
          { value: "advanced", label: "Advanced — automated governance" },
        ]}
        value={getStringAnswer(answers["ai_governance"])}
        onChange={(val) => onAnswer("ai_governance", val)}
      />
    </div>
  );
} 