"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_scaling"] === "string" &&
    typeof answers["ai_risk_management"] === "string" &&
    typeof answers["ai_strategy_alignment"] === "string" &&
    typeof answers["ai_budget_allocation"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_scaling */}
      <MultipleChoiceQuestion
        question="How are you scaling AI use across your organization?"
        options={[
          { value: "not_scaling", label: "Not actively scaling yet" },
          { value: "individual_teams", label: "Individual teams scaling AI use independently" },
          { value: "coordinated_initiatives", label: "Scaling through coordinated cross-team initiatives" },
          { value: "enterprise_strategy", label: "Scaling as part of an enterprise-wide strategy" },
        ]}
        value={answers["ai_scaling"] || ""}
        onChange={(val) => onAnswer("ai_scaling", val)}
      />

      {/* Question 5: ai_risk_management */}
      <MultipleChoiceQuestion
        question="What’s your approach to managing AI-related risks (e.g., compliance, legal, ethical)?"
        options={[
          { value: "no_risk_management", label: "We don’t have one yet" },
          { value: "basic_awareness", label: "We’ve identified some risks but handle them ad hoc" },
          { value: "review_processes", label: "We review risk at the use-case level" },
          { value: "formal_governance", label: "We have formalized risk management as part of governance" },
        ]}
        value={answers["ai_risk_management"] || ""}
        onChange={(val) => onAnswer("ai_risk_management", val)}
      />

      {/* Question 6: ai_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How well is your AI work aligned with broader business strategy?"
        options={[
          { value: "not_aligned", label: "Not well aligned — ad hoc experimentation" },
          { value: "some_alignment", label: "Some alignment with key priorities" },
          { value: "formal_alignment", label: "Formally aligned with strategic goals" },
          { value: "tightly_integrated", label: "Tightly integrated into our business strategy" },
        ]}
        value={answers["ai_strategy_alignment"] || ""}
        onChange={(val) => onAnswer("ai_strategy_alignment", val)}
      />

      {/* Question 7: ai_budget_allocation */}
      <MultipleChoiceQuestion
        question="Do you have a defined budget or resources for AI initiatives?"
        options={[
          { value: "no_budget", label: "No dedicated budget" },
          { value: "minimal_budget", label: "Small or informal budget" },
          { value: "department_level", label: "Department-level budgets or pilots" },
          { value: "central_funding", label: "Central funding and long-term allocation" },
        ]}
        value={answers["ai_budget_allocation"] || ""}
        onChange={(val) => onAnswer("ai_budget_allocation", val)}
      />
    </div>
  );
}
