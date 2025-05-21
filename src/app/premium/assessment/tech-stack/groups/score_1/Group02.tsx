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

export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["automation_level"] === "string" &&
    typeof answers["platform_adoption"] === "string" &&
    typeof answers["workflow_efficiency"] === "string"
  );
}

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="What level of automation exists in your current processes?"
        options={[
          { value: "none", label: "None — everything is manual" },
          { value: "basic", label: "Basic — some automated tasks" },
          { value: "partial", label: "Partial — key processes are automated" },
          { value: "extensive", label: "Extensive — most processes are automated" },
        ]}
        value={getStringAnswer(answers["automation_level"])}
        onChange={(val) => onAnswer("automation_level", val)}
      />

      <MultipleChoiceQuestion
        question="How widely adopted are your core technology platforms?"
        options={[
          { value: "limited", label: "Limited — only used by a few teams" },
          { value: "partial", label: "Partial — used by some departments" },
          { value: "majority", label: "Majority — used by most teams" },
          { value: "complete", label: "Complete — used across all departments" },
        ]}
        value={getStringAnswer(answers["platform_adoption"])}
        onChange={(val) => onAnswer("platform_adoption", val)}
      />

      <MultipleChoiceQuestion
        question="How efficient are your current technology workflows?"
        options={[
          { value: "inefficient", label: "Inefficient — many manual steps and delays" },
          { value: "basic", label: "Basic — some efficiency but with bottlenecks" },
          { value: "streamlined", label: "Streamlined — mostly efficient with few issues" },
          { value: "optimized", label: "Optimized — highly efficient with automation" },
        ]}
        value={getStringAnswer(answers["workflow_efficiency"])}
        onChange={(val) => onAnswer("workflow_efficiency", val)}
      />
    </div>
  );
} 