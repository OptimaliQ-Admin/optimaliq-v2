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

export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["process_automation"] === "string" &&
    typeof answers["platform_maturity"] === "string" &&
    typeof answers["workflow_optimization"] === "string"
  );
}

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How sophisticated is your process automation?"
        options={[
          { value: "manual", label: "Mostly manual — limited automation" },
          { value: "basic_automation", label: "Basic automation — simple task automation" },
          { value: "advanced_automation", label: "Advanced automation — complex workflows" },
          { value: "intelligent", label: "Intelligent automation — AI-driven processes" },
        ]}
        value={getStringAnswer(answers["process_automation"])}
        onChange={(val) => onAnswer("process_automation", val)}
      />

      <MultipleChoiceQuestion
        question="How mature is your platform ecosystem?"
        options={[
          { value: "nascent", label: "Nascent — basic platform usage" },
          { value: "developing", label: "Developing — growing platform adoption" },
          { value: "mature", label: "Mature — well-established platforms" },
          { value: "advanced", label: "Advanced — fully integrated platform ecosystem" },
        ]}
        value={getStringAnswer(answers["platform_maturity"])}
        onChange={(val) => onAnswer("platform_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How optimized are your technology workflows?"
        options={[
          { value: "basic", label: "Basic — standard workflows with manual steps" },
          { value: "streamlined", label: "Streamlined — optimized key processes" },
          { value: "efficient", label: "Efficient — most workflows are automated" },
          { value: "highly_optimized", label: "Highly optimized — continuous improvement" },
        ]}
        value={getStringAnswer(answers["workflow_optimization"])}
        onChange={(val) => onAnswer("workflow_optimization", val)}
      />
    </div>
  );
} 