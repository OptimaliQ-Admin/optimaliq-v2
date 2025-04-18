"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["sales_velocity_tracking"] === "string" &&
    answers["sales_velocity_tracking"].trim().length > 0 &&
    typeof answers["rep_consistency"] === "string" &&
    answers["rep_consistency"].trim().length > 0 &&
    Array.isArray(answers["reviewed_metrics"]) &&
    answers["reviewed_metrics"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  const reviewed = answers["reviewed_metrics"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: sales_velocity_tracking */}
      <MultipleChoiceQuestion
        question="How do you monitor and improve sales velocity (i.e. speed through pipeline)?"
        options={[
          { value: "dont_track", label: "We don’t track it" },
          { value: "review_agings", label: "We review deal aging and cycle length occasionally" },
          { value: "measured_metrics", label: "We measure it with defined metrics" },
          { value: "optimize_velocity", label: "We actively optimize for velocity" },
        ]}
        value={answers["sales_velocity_tracking"] || ""}
        onChange={(val) => onAnswer("sales_velocity_tracking", val)}
      />

      {/* Question 2: rep_consistency */}
      <MultipleChoiceQuestion
        question="What level of consistency do you see in how different reps execute?"
        options={[
          { value: "all_different", label: "Everyone does it differently" },
          { value: "some_follow", label: "Most reps follow a general structure" },
          { value: "consistent_execution", label: "Most reps follow the process consistently" },
          { value: "highly_consistent", label: "Execution is highly consistent across the team" },
        ]}
        value={answers["rep_consistency"] || ""}
        onChange={(val) => onAnswer("rep_consistency", val)}
      />

      {/* Question 3: reviewed_metrics */}
      <MultiSelectQuestion
        question="Which of the following metrics do you review regularly?"
        options={[
          { value: "pipeline_coverage", label: "Pipeline coverage" },
          { value: "deal_velocity", label: "Deal velocity" },
          { value: "conversion_rates", label: "Conversion rates by stage" },
          { value: "win_rates", label: "Win rates by rep" },
          { value: "none", label: "We don’t review metrics consistently" },
        ]}
        selected={reviewed}
        onChange={(val) => onAnswer("reviewed_metrics", val)}
        maxSelect={5}
      />
    </div>
  );
}
