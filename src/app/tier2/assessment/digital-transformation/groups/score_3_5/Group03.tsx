"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["modernization_strategy"] === "string" &&
    typeof answers["workflow_efficiency"] === "string" &&
    typeof answers["optimization_maturity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: modernization_strategy */}
      <MultipleChoiceQuestion
        question="What best describes your current approach to system modernization?"
        options={[
          { value: "no_plan", label: "We don’t really have a modernization plan" },
          { value: "in_progress", label: "We’re starting to upgrade or consolidate" },
          { value: "actively_modernizing", label: "We’re actively replacing legacy systems" },
          { value: "fully_modern", label: "Our stack is modern and continuously improved" },
        ]}
        value={answers["modernization_strategy"] || ""}
        onChange={(val) => onAnswer("modernization_strategy", val)}
      />

      {/* Question 9: workflow_efficiency */}
      <MultipleChoiceQuestion
        question="How efficient are your workflows across systems and teams?"
        options={[
          { value: "manual_and_slow", label: "Manual and slow — many handoffs and delays" },
          { value: "partially_optimized", label: "Partially optimized — some automation or syncs" },
          { value: "mostly_automated", label: "Mostly automated — strong internal systems" },
          { value: "streamlined_and_scalable", label: "Streamlined and scalable — very few bottlenecks" },
        ]}
        value={answers["workflow_efficiency"] || ""}
        onChange={(val) => onAnswer("workflow_efficiency", val)}
      />

      {/* Question 10: optimization_maturity */}
      <MultipleChoiceQuestion
        question="How would you describe your maturity with continuous process improvement?"
        options={[
          { value: "no_review", label: "We don’t revisit workflows unless there’s an issue" },
          { value: "some_reviews", label: "We review some processes each year" },
          { value: "structured_reviews", label: "We have structured reviews and process owners" },
          { value: "fully_mature", label: "Continuous optimization is built into our operations" },
        ]}
        value={answers["optimization_maturity"] || ""}
        onChange={(val) => onAnswer("optimization_maturity", val)}
      />
    </div>
  );
}
