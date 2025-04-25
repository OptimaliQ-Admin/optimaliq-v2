"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_1579c0"] === "string" &&
    typeof answers["how_ed3928"] === "string" &&
    Array.isArray(answers["which_549cbb"]) &&
    answers["which_549cbb"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  const automation = answers["which_549cbb"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_1579c0 */}
      <MultipleChoiceQuestion
        question="How are your sales forecasts used beyond the sales team (e.g. finance, ops, product)?"
        options={[
          { value: "not_used", label: "They aren’t really used outside sales" },
          { value: "shared_with_leadership", label: "Shared with leadership as needed" },
          { value: "reviewed_in_ops", label: "Reviewed in ops or finance meetings" },
          { value: "integrated_planning", label: "Integrated into planning and resourcing org-wide" },
        ]}
        value={getStringAnswer(answers["how_1579c0"])}
        onChange={(val) => onAnswer("how_1579c0", val)}
      />

      {/* Question 2: how_ed3928 */}
      <MultipleChoiceQuestion
        question="How do you ensure consistent adoption of your sales methodology across teams or regions?"
        options={[
          { value: "manager_reinforced", label: "We rely on managers to reinforce it" },
          { value: "resources_and_reminders", label: "We provide resources and reminders" },
          { value: "audit_and_review", label: "We audit usage and review deals" },
          { value: "enforced_systems", label: "It’s enforced via systems, coaching, and scorecards" },
        ]}
        value={getStringAnswer(answers["how_ed3928"])}
        onChange={(val) => onAnswer("how_ed3928", val)}
      />

      {/* Question 3: which_549cbb */}
      <MultiSelectQuestion
        question="Which of the following are automated or streamlined in your sales process?"
        options={[
          { value: "lead_routing", label: "Lead routing" },
          { value: "follow_ups", label: "Follow-up sequences" },
          { value: "proposal_creation", label: "Proposal creation" },
          { value: "handoff", label: "Handoff to Customer Success" },
          { value: "forecast_rollups", label: "Forecast roll-ups" },
        ]}
        selected={Array.isArray(getArrayAnswer(automation)) ? getArrayAnswer(automation) : []}
        onChange={(val) => onAnswer("which_549cbb", val)}
        maxSelect={5}
      />
    </div>
  );
}
