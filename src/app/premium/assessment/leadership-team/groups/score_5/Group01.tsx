"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["executive_coaching"] === "string" &&
    typeof answers["succession_planning"] === "string" &&
    typeof answers["talent_strategy"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: executive_coaching */}
      <MultipleChoiceQuestion
        question="How embedded is executive coaching in your leadership model?"
        options={[
          { value: "not_used", label: "It’s not really part of our approach" },
          { value: "offered_if_needed", label: "It’s offered occasionally or when needed" },
          { value: "actively_used", label: "Actively used across our leadership team" },
          { value: "strategic_coaching", label: "It’s a core element of our leadership development strategy" },
        ]}
        value={answers["executive_coaching"] || ""}
        onChange={(val) => onAnswer("executive_coaching", val)}
      />

      {/* Question 2: succession_planning */}
      <MultipleChoiceQuestion
        question="What does your succession planning look like?"
        options={[
          { value: "none", label: "We don’t really have one" },
          { value: "some_names", label: "Some names identified informally" },
          { value: "documented", label: "It’s documented with plans for key roles" },
          { value: "well_defined", label: "There’s a well-defined and tested succession process" },
        ]}
        value={answers["succession_planning"] || ""}
        onChange={(val) => onAnswer("succession_planning", val)}
      />

      {/* Question 3: talent_strategy */}
      <MultipleChoiceQuestion
        question="How does your leadership team engage in long-term talent strategy?"
        options={[
          { value: "short_term_hiring", label: "We focus on short-term hiring needs" },
          { value: "some_future_planning", label: "We plan for the future occasionally" },
          { value: "integrated_with_growth", label: "Talent strategy is integrated with growth plans" },
          { value: "future_workforce_ready", label: "We plan for future workforce needs and evolving roles" },
        ]}
        value={answers["talent_strategy"] || ""}
        onChange={(val) => onAnswer("talent_strategy", val)}
      />
    </div>
  );
}
