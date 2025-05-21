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

export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cloud_architecture"] === "string" &&
    typeof answers["container_strategy"] === "string" &&
    typeof answers["serverless_adoption"] === "string"
  );
}

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your cloud architecture?"
        options={[
          { value: "basic", label: "Basic — lift and shift to cloud" },
          { value: "optimized", label: "Optimized — cloud-optimized applications" },
          { value: "cloud_native", label: "Cloud-native — designed for cloud" },
          { value: "multi_cloud", label: "Multi-cloud — distributed across providers" },
        ]}
        value={getStringAnswer(answers["cloud_architecture"])}
        onChange={(val) => onAnswer("cloud_architecture", val)}
      />

      <MultipleChoiceQuestion
        question="How mature is your container strategy?"
        options={[
          { value: "experimental", label: "Experimental — testing containers" },
          { value: "adopting", label: "Adopting — containerizing applications" },
          { value: "mature", label: "Mature — container-first approach" },
          { value: "advanced", label: "Advanced — container orchestration" },
        ]}
        value={getStringAnswer(answers["container_strategy"])}
        onChange={(val) => onAnswer("container_strategy", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach serverless computing?"
        options={[
          { value: "evaluating", label: "Evaluating — exploring serverless" },
          { value: "selective", label: "Selective — specific use cases" },
          { value: "strategic", label: "Strategic — planned adoption" },
          { value: "extensive", label: "Extensive — serverless-first" },
        ]}
        value={getStringAnswer(answers["serverless_adoption"])}
        onChange={(val) => onAnswer("serverless_adoption", val)}
      />
    </div>
  );
} 