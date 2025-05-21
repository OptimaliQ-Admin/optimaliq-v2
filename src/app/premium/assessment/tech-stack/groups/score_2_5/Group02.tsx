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

export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["api_maturity"] === "string" &&
    typeof answers["devops_practices"] === "string" &&
    typeof answers["automation_coverage"] === "string"
  );
}

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How mature is your API strategy?"
        options={[
          { value: "basic", label: "Basic — internal APIs only" },
          { value: "developing", label: "Developing — some external APIs" },
          { value: "mature", label: "Mature — comprehensive API ecosystem" },
          { value: "advanced", label: "Advanced — API-first architecture" },
        ]}
        value={getStringAnswer(answers["api_maturity"])}
        onChange={(val) => onAnswer("api_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How advanced are your DevOps practices?"
        options={[
          { value: "traditional", label: "Traditional — manual processes" },
          { value: "basic_automation", label: "Basic automation — CI/CD pipelines" },
          { value: "advanced", label: "Advanced — full automation" },
          { value: "continuous", label: "Continuous — everything as code" },
        ]}
        value={getStringAnswer(answers["devops_practices"])}
        onChange={(val) => onAnswer("devops_practices", val)}
      />

      <MultipleChoiceQuestion
        question="How comprehensive is your automation coverage?"
        options={[
          { value: "partial", label: "Partial — key processes automated" },
          { value: "substantial", label: "Substantial — most processes automated" },
          { value: "extensive", label: "Extensive — nearly all processes automated" },
          { value: "complete", label: "Complete — fully automated operations" },
        ]}
        value={getStringAnswer(answers["automation_coverage"])}
        onChange={(val) => onAnswer("automation_coverage", val)}
      />
    </div>
  );
} 