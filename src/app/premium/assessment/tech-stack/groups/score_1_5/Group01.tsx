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

export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_architecture"] === "string" &&
    typeof answers["data_governance"] === "string" &&
    typeof answers["system_reliability"] === "string"
  );
}

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your technology architecture?"
        options={[
          { value: "fragmented", label: "Fragmented — multiple disconnected systems" },
          { value: "basic_integrated", label: "Basic integration — some connected systems" },
          { value: "well_structured", label: "Well-structured — clear architecture with some gaps" },
          { value: "enterprise", label: "Enterprise-grade — comprehensive and scalable" },
        ]}
        value={getStringAnswer(answers["tech_architecture"])}
        onChange={(val) => onAnswer("tech_architecture", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle data governance and security?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — basic security measures" },
          { value: "standard", label: "Standard — documented policies and procedures" },
          { value: "comprehensive", label: "Comprehensive — regular audits and compliance" },
          { value: "advanced", label: "Advanced — automated governance and monitoring" },
        ]}
        value={getStringAnswer(answers["data_governance"])}
        onChange={(val) => onAnswer("data_governance", val)}
      />

      <MultipleChoiceQuestion
        question="How reliable are your core technology systems?"
        options={[
          { value: "unreliable", label: "Unreliable — frequent issues and downtime" },
          { value: "moderate", label: "Moderate — occasional issues but manageable" },
          { value: "reliable", label: "Reliable — stable with good uptime" },
          { value: "high_availability", label: "High availability — redundant and resilient" },
        ]}
        value={getStringAnswer(answers["system_reliability"])}
        onChange={(val) => onAnswer("system_reliability", val)}
      />
    </div>
  );
} 