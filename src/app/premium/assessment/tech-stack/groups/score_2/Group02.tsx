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

export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["integration_maturity"] === "string" &&
    typeof answers["automation_sophistication"] === "string" &&
    typeof answers["process_optimization"] === "string"
  );
}

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How mature is your system integration?"
        options={[
          { value: "point_to_point", label: "Point-to-point — basic system connections" },
          { value: "hub_spoke", label: "Hub-spoke — centralized integration" },
          { value: "service_mesh", label: "Service mesh — distributed integration" },
          { value: "event_driven", label: "Event-driven — real-time integration" },
        ]}
        value={getStringAnswer(answers["integration_maturity"])}
        onChange={(val) => onAnswer("integration_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How sophisticated is your automation?"
        options={[
          { value: "task_automation", label: "Task automation — basic process automation" },
          { value: "workflow_automation", label: "Workflow automation — end-to-end processes" },
          { value: "intelligent_automation", label: "Intelligent automation — AI-enhanced" },
          { value: "autonomous", label: "Autonomous — self-optimizing systems" },
        ]}
        value={getStringAnswer(answers["automation_sophistication"])}
        onChange={(val) => onAnswer("automation_sophistication", val)}
      />

      <MultipleChoiceQuestion
        question="How optimized are your business processes?"
        options={[
          { value: "standardized", label: "Standardized — documented processes" },
          { value: "streamlined", label: "Streamlined — optimized workflows" },
          { value: "continuous", label: "Continuous — ongoing optimization" },
          { value: "predictive", label: "Predictive — AI-driven optimization" },
        ]}
        value={getStringAnswer(answers["process_optimization"])}
        onChange={(val) => onAnswer("process_optimization", val)}
      />
    </div>
  );
} 