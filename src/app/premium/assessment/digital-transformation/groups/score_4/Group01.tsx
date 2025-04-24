"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tools_aligned_with_goals"] === "string" &&
    Array.isArray(answers["strategy_execution_components"]) &&
    typeof answers["transformation_communication"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  const selected = answers["strategy_execution_components"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How are digital tools aligned with revenue growth or cost efficiency?"
        options={[
          { value: "loosely_aligned", label: "Loosely aligned by department" },
          { value: "reviewed_during_projects", label: "Reviewed during digital projects" },
          { value: "alignment_principles", label: "We use principles or OKRs for alignment" },
          { value: "fully_integrated", label: "Fully integrated with planning and performance" },
        ]}
        value={getStringAnswer(answers["tools_aligned_with_goals"])}
        onChange={(val) => onAnswer("tools_aligned_with_goals", val)}
      />

      {/* Question 2 */}
      <MultiSelectQuestion
        question="Which of the following are part of your digital strategy execution?"
        options={[
          { value: "kpi_dashboards", label: "Real-time KPI dashboards" },
          { value: "automated_decision_support", label: "Automated decision support" },
          { value: "cross_functional_initiatives", label: "Cross-functional initiatives" },
          { value: "change_management_plans", label: "Change management plans" },
          { value: "none", label: "None of the above" },
        ]}
        selected={selected}
        onChange={(val) => onAnswer("strategy_execution_components", val)}
        maxSelect={5}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How is transformation progress communicated across the organization?"
        options={[
          { value: "project_team_only", label: "Only within the project team" },
          { value: "some_meetings", label: "Shared in all-hands or department meetings" },
          { value: "executive_reporting", label: "Reported to executives and sponsors" },
          { value: "dashboards_available", label: "Dashboards and updates are accessible org-wide" },
        ]}
        value={getStringAnswer(answers["transformation_communication"])}
        onChange={(val) => onAnswer("transformation_communication", val)}
      />
    </div>
  );
}
