"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["digital_priority"] === "string" &&
    typeof answers["tech_stack_age"] === "string" &&
    typeof answers["current_challenges"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How would you describe your company’s current approach to digital transformation?"
        options={[
          { value: "not_a_priority", label: "It’s not really a priority for us" },
          { value: "thinking_about_it", label: "We’ve started thinking about it" },
          { value: "basic_initiatives", label: "We’ve launched some basic initiatives" },
          { value: "actively_planning", label: "We’re actively planning or investing in digital change" },
        ]}
        value={answers["digital_priority"] || ""}
        onChange={(val) => onAnswer("digital_priority", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How modern is your current tech stack?"
        options={[
          { value: "very_outdated", label: "Very outdated — it holds us back" },
          { value: "somewhat_outdated", label: "Somewhat outdated — we make it work" },
          { value: "moderately_modern", label: "Moderately modern — a few strong tools" },
          { value: "very_modern", label: "Very modern — we’re well-equipped" },
        ]}
        value={answers["tech_stack_age"] || ""}
        onChange={(val) => onAnswer("tech_stack_age", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="What’s your biggest challenge with digital transformation today?"
        options={[
          { value: "not_sure_where_to_start", label: "We’re not sure where to start" },
          { value: "budget_constraints", label: "Budget or leadership support" },
          { value: "legacy_systems", label: "Legacy systems or technical debt" },
          { value: "change_resistance", label: "Team adoption or resistance to change" },
        ]}
        value={answers["current_challenges"] || ""}
        onChange={(val) => onAnswer("current_challenges", val)}
      />
    </div>
  );
}
