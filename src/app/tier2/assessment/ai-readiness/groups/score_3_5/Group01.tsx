"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_expansion_strategy"] === "string" &&
    typeof answers["ai_cost_benefit_clarity"] === "string" &&
    typeof answers["ai_alignment_with_goals"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_expansion_strategy */}
      <MultipleChoiceQuestion
        question="Do you have a strategy for expanding AI usage across the business?"
        options={[
          { value: "no_clear_strategy", label: "Not really — it’s reactive or opportunistic" },
          { value: "loose_ideas", label: "Some loose ideas or conversations happening" },
          { value: "roadmap_exists", label: "We have a roadmap but it’s not fully funded or aligned" },
          { value: "well_defined_strategy", label: "Yes — we have a well-defined and resourced strategy" },
        ]}
        value={answers["ai_expansion_strategy"] || ""}
        onChange={(val) => onAnswer("ai_expansion_strategy", val)}
      />

      {/* Question 2: ai_cost_benefit_clarity */}
      <MultipleChoiceQuestion
        question="How clear is the ROI or value story behind your AI initiatives?"
        options={[
          { value: "not_clear", label: "Not clear at all — we’re experimenting without metrics" },
          { value: "some_success_metrics", label: "We track a few success metrics or outcomes" },
          { value: "clear_impact", label: "We have a clear sense of impact in specific areas" },
          { value: "quantified_and_tracked", label: "We quantify and regularly track cost/benefit" },
        ]}
        value={answers["ai_cost_benefit_clarity"] || ""}
        onChange={(val) => onAnswer("ai_cost_benefit_clarity", val)}
      />

      {/* Question 3: ai_alignment_with_goals */}
      <MultipleChoiceQuestion
        question="How well do your AI efforts align with company goals and KPIs?"
        options={[
          { value: "no_alignment", label: "There’s no formal alignment — it’s experimental" },
          { value: "loosely_linked", label: "Loosely linked to key priorities or themes" },
          { value: "partially_mapped", label: "Partially mapped to business unit OKRs" },
          { value: "directly_integrated", label: "Directly integrated into strategy and measurement" },
        ]}
        value={answers["ai_alignment_with_goals"] || ""}
        onChange={(val) => onAnswer("ai_alignment_with_goals", val)}
      />
    </div>
  );
}
