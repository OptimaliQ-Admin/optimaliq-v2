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

export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["microservices_maturity"] === "string" &&
    typeof answers["service_mesh"] === "string" &&
    typeof answers["api_gateway"] === "string"
  );
}

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How mature is your microservices architecture?"
        options={[
          { value: "monolithic", label: "Monolithic — traditional applications" },
          { value: "transitioning", label: "Transitioning — breaking up monoliths" },
          { value: "microservices", label: "Microservices — distributed services" },
          { value: "advanced", label: "Advanced — domain-driven design" },
        ]}
        value={getStringAnswer(answers["microservices_maturity"])}
        onChange={(val) => onAnswer("microservices_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle service mesh implementation?"
        options={[
          { value: "none", label: "None — no service mesh" },
          { value: "planning", label: "Planning — evaluating options" },
          { value: "implementing", label: "Implementing — partial adoption" },
          { value: "mature", label: "Mature — full service mesh" },
        ]}
        value={getStringAnswer(answers["service_mesh"])}
        onChange={(val) => onAnswer("service_mesh", val)}
      />

      <MultipleChoiceQuestion
        question="How do you manage API gateways?"
        options={[
          { value: "basic", label: "Basic — simple API routing" },
          { value: "standard", label: "Standard — API management" },
          { value: "advanced", label: "Advanced — API governance" },
          { value: "enterprise", label: "Enterprise — full API lifecycle" },
        ]}
        value={getStringAnswer(answers["api_gateway"])}
        onChange={(val) => onAnswer("api_gateway", val)}
      />
    </div>
  );
} 