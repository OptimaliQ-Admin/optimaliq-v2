"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["long_term_planning"] === "string" &&
    typeof answers["cross_function_alignment"] === "string" &&
    typeof answers["executive_visibility"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: long_term_planning */}
      <MultipleChoiceQuestion
        question="What’s your approach to long-term planning?"
        options={[
          { value: "no_plan", label: "We don’t have one" },
          { value: "short_term_only", label: "We only plan 3–6 months out" },
          { value: "some_long_term", label: "We create 1–2 year plans" },
          { value: "multi_year", label: "We have 3+ year roadmaps tied to strategy" },
        ]}
        value={answers["long_term_planning"] || ""}
        onChange={(val) => onAnswer("long_term_planning", val)}
      />

      {/* Question 9: cross_function_alignment */}
      <MultipleChoiceQuestion
        question="How well do cross-functional teams align around strategic priorities?"
        options={[
          { value: "not_aligned", label: "They’re not aligned at all" },
          { value: "occasional_conflict", label: "We see occasional conflict" },
          { value: "mostly_coordinated", label: "They coordinate fairly well" },
          { value: "fully_aligned", label: "They’re fully aligned and collaborative" },
        ]}
        value={answers["cross_function_alignment"] || ""}
        onChange={(val) => onAnswer("cross_function_alignment", val)}
      />

      {/* Question 10: executive_visibility */}
      <MultipleChoiceQuestion
        question="How visible is strategic progress to your executive team?"
        options={[
          { value: "no_reporting", label: "There’s no formal reporting" },
          { value: "infrequent_updates", label: "They receive occasional updates" },
          { value: "regular_checkins", label: "They review metrics in regular meetings" },
          { value: "real_time_visibility", label: "They have real-time dashboards or alerts" },
        ]}
        value={answers["executive_visibility"] || ""}
        onChange={(val) => onAnswer("executive_visibility", val)}
      />
    </div>
  );
}
