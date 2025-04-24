"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["transformational_mindset"] === "string" &&
    typeof answers["innovation_leadership"] === "string" &&
    typeof answers["benchmarking_practice"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How would you describe your company’s overall approach to transformation?"
        options={[
          { value: "operational_improvement", label: "Focused mostly on operational improvement" },
          { value: "incremental_innovation", label: "We embrace incremental innovation" },
          { value: "bold_changes", label: "We pursue bold, disruptive changes when needed" },
          { value: "transformation_leader", label: "We are seen as a leader in transformation" },
        ]}
        value={answers["transformational_mindset"] || ""}
        onChange={(val) => onAnswer("transformational_mindset", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="What role does leadership play in driving digital innovation?"
        options={[
          { value: "not_involved", label: "Minimal — innovation happens bottom-up" },
          { value: "supportive", label: "Supportive, but not leading" },
          { value: "champions", label: "Leaders actively champion innovation" },
          { value: "strategic_innovation", label: "Innovation is embedded in leadership strategy" },
        ]}
        value={answers["innovation_leadership"] || ""}
        onChange={(val) => onAnswer("innovation_leadership", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How do you benchmark your digital performance?"
        options={[
          { value: "no_benchmarking", label: "We don’t benchmark at all" },
          { value: "internal_only", label: "We do internal benchmarking" },
          { value: "peer_comparison", label: "We compare to similar companies" },
          { value: "industry_leading", label: "We benchmark against industry leaders and best practices" },
        ]}
        value={answers["benchmarking_practice"] || ""}
        onChange={(val) => onAnswer("benchmarking_practice", val)}
      />
    </div>
  );
}
