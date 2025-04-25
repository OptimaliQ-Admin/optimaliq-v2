"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_alignment_method"] === "string" &&
    typeof answers["goal_communication"] === "string" &&
    typeof answers["decision_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How do you ensure that day-to-day initiatives align with strategic goals?"
        options={[
          { value: "project_by_project", label: "We align on a project-by-project basis" },
          { value: "quarterly_reviews", label: "Quarterly reviews and course correction" },
          { value: "scorecards", label: "We use scorecards and KPIs for alignment" },
          { value: "embedded_in_ops", label: "Strategic goals are embedded in daily operations" },
        ]}
        value={getStringAnswer(answers["strategic_alignment_method"])}
        onChange={(val) => onAnswer("strategic_alignment_method", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How are long-term strategic goals communicated across the business?"
        options={[
          { value: "executive_only", label: "Only at the executive level" },
          { value: "announced_annually", label: "Announced annually to all staff" },
          { value: "included_in_team_goals", label: "Included in department or team goals" },
          { value: "cascaded_and_tracked", label: "Cascaded across levels and tracked regularly" },
        ]}
        value={getStringAnswer(answers["goal_communication"])}
        onChange={(val) => onAnswer("goal_communication", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How do you ensure team-level decisions reflect broader strategic direction?"
        options={[
          { value: "trust_instinct", label: "We trust managers to use instinct" },
          { value: "top_down_guidance", label: "Guidance is shared during planning cycles" },
          { value: "decision_frameworks", label: "We use defined decision frameworks" },
          { value: "strategy_in_tooling", label: "Strategic logic is built into tooling and workflows" },
        ]}
        value={getStringAnswer(answers["decision_alignment"])}
        onChange={(val) => onAnswer("decision_alignment", val)}
      />
    </div>
  );
}
