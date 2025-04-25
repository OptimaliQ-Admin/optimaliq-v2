"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_metric_tracking"] === "string" &&
    typeof answers["cx_data_access"] === "string" &&
    typeof answers["cx_prioritization"] === "string" &&
    typeof answers["cx_accountability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      {/* Question 4: cx_metric_tracking */}
      <MultipleChoiceQuestion
        question="What types of customer experience (CX) metrics do you track?"
        options={[
          { value: "none", label: "None consistently" },
          { value: "basic", label: "Basic satisfaction scores or feedback" },
          { value: "blended", label: "Blended CX + operational data" },
          { value: "real_time", label: "Real-time CX metrics by touchpoint" },
        ]}
        value={getStringAnswer(answers["cx_metric_tracking"])}
        onChange={(val) => onAnswer("cx_metric_tracking", val)}
      />

      {/* Question 5: cx_data_access */}
      <MultipleChoiceQuestion
        question="How accessible is CX data to teams who need it?"
        options={[
          { value: "restricted", label: "Restricted to specific roles or systems" },
          { value: "shared_on_request", label: "Available on request or ad hoc" },
          { value: "self_service", label: "Self-serve dashboards available" },
          { value: "embedded", label: "Embedded in team workflows and tools" },
        ]}
        value={getStringAnswer(answers["cx_data_access"])}
        onChange={(val) => onAnswer("cx_data_access", val)}
      />

      {/* Question 6: cx_prioritization */}
      <MultipleChoiceQuestion
        question="How are CX improvement efforts prioritized?"
        options={[
          { value: "not_prioritized", label: "Not clearly prioritized or budgeted" },
          { value: "based_on_feedback", label: "Based on urgent issues or feedback" },
          { value: "planned_in_advance", label: "Planned as part of team OKRs or goals" },
          { value: "aligned_with_strategy", label: "Tied to company-wide strategic priorities" },
        ]}
        value={getStringAnswer(answers["cx_prioritization"])}
        onChange={(val) => onAnswer("cx_prioritization", val)}
      />

      {/* Question 7: cx_accountability */}
      <MultipleChoiceQuestion
        question="Who is accountable for customer experience outcomes?"
        options={[
          { value: "no_one", label: "No one formally owns it" },
          { value: "functional_leaders", label: "Functional leaders (support, success, etc.)" },
          { value: "shared_across_teams", label: "Shared across multiple teams" },
          { value: "dedicated_team", label: "Dedicated CX team or leadership role" },
        ]}
        value={getStringAnswer(answers["cx_accountability"])}
        onChange={(val) => onAnswer("cx_accountability", val)}
      />
    </div>
  );
}
