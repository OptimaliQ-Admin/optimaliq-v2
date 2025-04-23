"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cross_functional_strategy"] === "string" &&
    typeof answers["strategic_priorities_alignment"] === "string" &&
    typeof answers["goal_setting_approach"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 1: cross_functional_strategy */}
      <MultipleChoiceQuestion
        question="How often are cross-functional teams involved in shaping strategy?"
        options={[
          { value: "rarely", label: "Rarely — mostly executives decide" },
          { value: "sometimes", label: "Sometimes — we involve other departments when needed" },
          { value: "often", label: "Often — we bring in different teams for big initiatives" },
          { value: "always", label: "Always — cross-functional collaboration is standard" },
        ]}
        value={answers["cross_functional_strategy"] || ""}
        onChange={(val) => onAnswer("cross_functional_strategy", val)}
      />

      {/* Question 2: strategic_priorities_alignment */}
      <MultipleChoiceQuestion
        question="How well are your strategic priorities aligned across departments?"
        options={[
          { value: "poor_alignment", label: "Poorly — everyone has their own priorities" },
          { value: "some_alignment", label: "Somewhat — we try to coordinate" },
          { value: "mostly_aligned", label: "Mostly aligned — we’re moving in the same direction" },
          { value: "fully_aligned", label: "Fully aligned — goals are tightly connected across teams" },
        ]}
        value={answers["strategic_priorities_alignment"] || ""}
        onChange={(val) => onAnswer("strategic_priorities_alignment", val)}
      />

      {/* Question 3: goal_setting_approach */}
      <MultipleChoiceQuestion
        question="Which best describes your goal-setting approach?"
        options={[
          { value: "no_goals", label: "We don’t formally set goals" },
          { value: "informal_goals", label: "We set informal or high-level goals" },
          { value: "departmental_goals", label: "Departments set clear goals independently" },
          { value: "org_wide_goals", label: "We use company-wide goals cascaded across teams" },
        ]}
        value={answers["goal_setting_approach"] || ""}
        onChange={(val) => onAnswer("goal_setting_approach", val)}
      />
    </div>
  );
}
