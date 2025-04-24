"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["internal_vs_external_positioning"] === "string" &&
    typeof answers["benchmarking_alignment"] === "string" &&
    typeof answers["differentiation_strength"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: internal_vs_external_positioning */}
      <MultipleChoiceQuestion
        question="How well does your external positioning align with your internal view of the brand?"
        options={[
          { value: "no_alignment", label: "There’s no real alignment" },
          { value: "some_overlap", label: "Some overlap, but inconsistent" },
          { value: "mostly_consistent", label: "Mostly consistent with some misalignment" },
          { value: "fully_aligned", label: "Fully aligned and intentional" },
        ]}
        value={answers["internal_vs_external_positioning"] || ""}
        onChange={(val) => onAnswer("internal_vs_external_positioning", val)}
      />

      {/* Question 9: benchmarking_alignment */}
      <MultipleChoiceQuestion
        question="Do your internal KPIs or OKRs include market positioning or benchmarking targets?"
        options={[
          { value: "no_kpis", label: "No — we focus on internal metrics only" },
          { value: "occasionally_considered", label: "Occasionally considered" },
          { value: "included_in_some_goals", label: "Included in some team goals" },
          { value: "fully_integrated", label: "Fully integrated into strategic planning" },
        ]}
        value={answers["benchmarking_alignment"] || ""}
        onChange={(val) => onAnswer("benchmarking_alignment", val)}
      />

      {/* Question 10: differentiation_strength */}
      <MultipleChoiceQuestion
        question="How differentiated is your brand compared to your competitors?"
        options={[
          { value: "not_differentiated", label: "Not differentiated — hard to tell us apart" },
          { value: "somewhat_different", label: "Somewhat — we highlight a few unique traits" },
          { value: "clearly_different", label: "Clearly different in messaging and offer" },
          { value: "highly_distinct", label: "Highly distinct — we lead with uniqueness" },
        ]}
        value={answers["differentiation_strength"] || ""}
        onChange={(val) => onAnswer("differentiation_strength", val)}
      />
    </div>
  );
}
