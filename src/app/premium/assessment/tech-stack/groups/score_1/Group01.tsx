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

export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_infrastructure"] === "string" &&
    typeof answers["data_management"] === "string" &&
    typeof answers["integration_status"] === "string"
  );
}

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your current technology infrastructure?"
        options={[
          { value: "basic", label: "Basic — minimal tech stack with essential tools only" },
          { value: "standard", label: "Standard — common tools but not fully integrated" },
          { value: "integrated", label: "Integrated — tools work together but with gaps" },
          { value: "advanced", label: "Advanced — well-integrated with automation" },
        ]}
        value={getStringAnswer(answers["tech_infrastructure"])}
        onChange={(val) => onAnswer("tech_infrastructure", val)}
      />

      <MultipleChoiceQuestion
        question="How do you manage and store your business data?"
        options={[
          { value: "manual", label: "Manual — spreadsheets and basic documents" },
          { value: "basic_systems", label: "Basic systems — simple databases or CRMs" },
          { value: "integrated", label: "Integrated — connected systems with some automation" },
          { value: "advanced", label: "Advanced — cloud-based with full integration" },
        ]}
        value={getStringAnswer(answers["data_management"])}
        onChange={(val) => onAnswer("data_management", val)}
      />

      <MultipleChoiceQuestion
        question="How well are your different technology systems integrated?"
        options={[
          { value: "not_integrated", label: "Not integrated — systems work independently" },
          { value: "manual_integration", label: "Manual integration — data shared manually" },
          { value: "partial", label: "Partially integrated — some automated connections" },
          { value: "fully", label: "Fully integrated — seamless data flow between systems" },
        ]}
        value={getStringAnswer(answers["integration_status"])}
        onChange={(val) => onAnswer("integration_status", val)}
      />
    </div>
  );
} 