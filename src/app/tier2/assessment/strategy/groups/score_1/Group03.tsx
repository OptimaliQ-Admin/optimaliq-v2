"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategic_consistency"] === "string" &&
    typeof answers["alignment_across_teams"] === "string" &&
    typeof answers["long_term_planning"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="How consistent is your strategy from quarter to quarter?"
        options={[
          { value: "constantly_changing", label: "It changes constantly or doesn’t exist" },
          { value: "frequent_shifts", label: "Frequent shifts depending on what’s urgent" },
          { value: "general_consistency", label: "Generally consistent with occasional changes" },
          { value: "very_consistent", label: "Very consistent with a clear long-term direction" },
        ]}
        value={answers["strategic_consistency"] || ""}
        onChange={(val) => onAnswer("strategic_consistency", val)}
      />

      <MultipleChoiceQuestion
        question="How well are different teams aligned to your overall strategy?"
        options={[
          { value: "not_aligned", label: "They aren’t — everyone’s doing their own thing" },
          { value: "some_alignment", label: "Some alignment but lots of silos" },
          { value: "mostly_aligned", label: "Mostly aligned, but not perfectly synced" },
          { value: "fully_aligned", label: "Fully aligned — goals cascade across departments" },
        ]}
        value={answers["alignment_across_teams"] || ""}
        onChange={(val) => onAnswer("alignment_across_teams", val)}
      />

      <MultipleChoiceQuestion
        question="What’s your approach to long-term planning?"
        options={[
          { value: "none", label: "We don’t do long-term planning" },
          { value: "some_plans", label: "We make plans, but rarely revisit them" },
          { value: "annual_cycle", label: "We plan annually and track progress" },
          { value: "ongoing_process", label: "We plan with flexibility and review regularly" },
        ]}
        value={answers["long_term_planning"] || ""}
        onChange={(val) => onAnswer("long_term_planning", val)}
      />
    </div>
  );
}
