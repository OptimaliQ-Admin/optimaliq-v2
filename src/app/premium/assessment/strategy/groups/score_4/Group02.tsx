"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["leadership_accountability"] === "string" &&
    typeof answers["risk_management"] === "string" &&
    typeof answers["mid_term_goals"] === "string" &&
    typeof answers["market_positioning"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      <MultipleChoiceQuestion
        question="Are leaders held accountable for progress on strategic goals?"
        options={[
          { value: "no_accountability", label: "Not really" },
          { value: "some_visibility", label: "Some visibility but no formal tracking" },
          { value: "reviewed_quarterly", label: "Reviewed quarterly or in planning cycles" },
          { value: "built_into_kpis", label: "Yes — built into KPIs and performance reviews" },
        ]}
        value={getStringAnswer(answers["leadership_accountability"])}
        onChange={(val) => onAnswer("leadership_accountability", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach strategic risk management?"
        options={[
          { value: "reactive", label: "We react to risks as they arise" },
          { value: "ad_hoc", label: "Ad hoc assessments during planning" },
          { value: "reviewed_routinely", label: "Reviewed routinely as part of decision-making" },
          { value: "proactive", label: "Proactively modeled and built into strategy" },
        ]}
        value={getStringAnswer(answers["risk_management"])}
        onChange={(val) => onAnswer("risk_management", val)}
      />

      <MultipleChoiceQuestion
        question="Are your mid-term goals (1–3 years) clearly documented and aligned with strategy?"
        options={[
          { value: "not_documented", label: "No — we mostly focus on short-term goals" },
          { value: "loosely_defined", label: "Loosely defined — some shared direction" },
          { value: "aligned", label: "Yes — documented and aligned to strategy" },
          { value: "tracked_and_measured", label: "Yes — with clear ownership and metrics" },
        ]}
        value={getStringAnswer(answers["mid_term_goals"])}
        onChange={(val) => onAnswer("mid_term_goals", val)}
      />

      <MultipleChoiceQuestion
        question="How often is your competitive positioning revisited?"
        options={[
          { value: "rarely", label: "Rarely — it’s static" },
          { value: "annually", label: "Annually, during planning" },
          { value: "quarterly", label: "Quarterly or semi-annually" },
          { value: "continuously", label: "Continuously — it informs go-to-market moves" },
        ]}
        value={getStringAnswer(answers["market_positioning"])}
        onChange={(val) => onAnswer("market_positioning", val)}
      />
    </div>
  );
}
