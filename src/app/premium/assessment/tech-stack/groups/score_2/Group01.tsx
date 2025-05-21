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

export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["enterprise_architecture"] === "string" &&
    typeof answers["data_ecosystem"] === "string" &&
    typeof answers["system_resilience"] === "string"
  );
}

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your enterprise architecture?"
        options={[
          { value: "traditional", label: "Traditional — legacy systems with some modernization" },
          { value: "hybrid", label: "Hybrid — mix of legacy and modern systems" },
          { value: "modern", label: "Modern — cloud-native with some legacy integration" },
          { value: "next_gen", label: "Next-gen — fully modern, microservices-based" },
        ]}
        value={getStringAnswer(answers["enterprise_architecture"])}
        onChange={(val) => onAnswer("enterprise_architecture", val)}
      />

      <MultipleChoiceQuestion
        question="How mature is your data ecosystem?"
        options={[
          { value: "siloed", label: "Siloed — data exists in separate systems" },
          { value: "integrated", label: "Integrated — data flows between systems" },
          { value: "unified", label: "Unified — single source of truth" },
          { value: "intelligent", label: "Intelligent — data-driven with AI/ML" },
        ]}
        value={getStringAnswer(answers["data_ecosystem"])}
        onChange={(val) => onAnswer("data_ecosystem", val)}
      />

      <MultipleChoiceQuestion
        question="How resilient are your technology systems?"
        options={[
          { value: "basic", label: "Basic — standard backup and recovery" },
          { value: "robust", label: "Robust — redundant systems and failover" },
          { value: "highly_resilient", label: "Highly resilient — multi-region, auto-scaling" },
          { value: "fault_tolerant", label: "Fault-tolerant — self-healing systems" },
        ]}
        value={getStringAnswer(answers["system_resilience"])}
        onChange={(val) => onAnswer("system_resilience", val)}
      />
    </div>
  );
} 