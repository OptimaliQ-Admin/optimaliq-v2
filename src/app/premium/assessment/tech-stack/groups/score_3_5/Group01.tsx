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

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_infrastructure"] === "string" &&
    typeof answers["ml_platform"] === "string" &&
    typeof answers["data_pipeline"] === "string"
  );
}

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How mature is your AI infrastructure?"
        options={[
          { value: "basic", label: "Basic — experimental AI capabilities" },
          { value: "developing", label: "Developing — dedicated AI resources" },
          { value: "advanced", label: "Advanced — scalable AI platform" },
          { value: "enterprise", label: "Enterprise — full AI infrastructure" },
        ]}
        value={getStringAnswer(answers["ai_infrastructure"])}
        onChange={(val) => onAnswer("ai_infrastructure", val)}
      />

      <MultipleChoiceQuestion
        question="How sophisticated is your ML platform?"
        options={[
          { value: "manual", label: "Manual — basic ML workflows" },
          { value: "automated", label: "Automated — ML pipeline automation" },
          { value: "integrated", label: "Integrated — end-to-end ML platform" },
          { value: "advanced", label: "Advanced — self-service ML platform" },
        ]}
        value={getStringAnswer(answers["ml_platform"])}
        onChange={(val) => onAnswer("ml_platform", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle data pipelines for AI/ML?"
        options={[
          { value: "basic", label: "Basic — manual data processing" },
          { value: "automated", label: "Automated — scheduled pipelines" },
          { value: "real_time", label: "Real-time — streaming pipelines" },
          { value: "intelligent", label: "Intelligent — adaptive pipelines" },
        ]}
        value={getStringAnswer(answers["data_pipeline"])}
        onChange={(val) => onAnswer("data_pipeline", val)}
      />
    </div>
  );
} 