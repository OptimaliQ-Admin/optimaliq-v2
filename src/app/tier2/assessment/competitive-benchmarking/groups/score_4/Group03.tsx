"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["differentiation_tracking"] === "string" &&
    typeof answers["insight_activation"] === "string" &&
    typeof answers["benchmarking_confidence"] === "string" &&
    typeof answers["competitive_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 7: differentiation_tracking */}
      <MultipleChoiceQuestion
        question="Do you know what clearly sets you apart from competitors?"
        options={[
          { value: "no_clear_differentiation", label: "No — we haven’t defined this clearly" },
          { value: "general_idea", label: "We have a general idea" },
          { value: "communicated_differentiation", label: "We’ve defined it and try to communicate it" },
          { value: "measured_and_messaged", label: "It’s clearly messaged and measured for impact" },
        ]}
        value={answers["differentiation_tracking"] || ""}
        onChange={(val) => onAnswer("differentiation_tracking", val)}
      />

      {/* Question 8: insight_activation */}
      <MultipleChoiceQuestion
        question="How often do you turn benchmarking insights into real action?"
        options={[
          { value: "rarely_use_benchmarking", label: "Rarely — we don’t use benchmarking consistently" },
          { value: "sometimes_discussed", label: "Sometimes discussed, but rarely acted on" },
          { value: "used_to_prioritize", label: "Used to prioritize initiatives" },
          { value: "core_to_strategy", label: "Benchmarking insights drive strategic decisions" },
        ]}
        value={answers["insight_activation"] || ""}
        onChange={(val) => onAnswer("insight_activation", val)}
      />

      {/* Question 9: benchmarking_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in your ability to benchmark accurately and effectively?"
        options={[
          { value: "not_confident", label: "Not confident at all" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "mostly_confident", label: "Mostly confident" },
          { value: "fully_confident", label: "Fully confident" },
        ]}
        value={answers["benchmarking_confidence"] || ""}
        onChange={(val) => onAnswer("benchmarking_confidence", val)}
      />

      {/* Question 10: competitive_alignment */}
      <MultipleChoiceQuestion
        question="To what extent are your go-to-market and brand strategies informed by competitive positioning?"
        options={[
          { value: "not_at_all", label: "Not at all — we don’t consider competitors" },
          { value: "basic_awareness", label: "We’re aware but not proactive" },
          { value: "partially_aligned", label: "Some campaigns or products align with gaps we’ve identified" },
          { value: "fully_aligned", label: "Our strategy is tightly aligned to market gaps and competitor weaknesses" },
        ]}
        value={answers["competitive_alignment"] || ""}
        onChange={(val) => onAnswer("competitive_alignment", val)}
      />
    </div>
  );
}
