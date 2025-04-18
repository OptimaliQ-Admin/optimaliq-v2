"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["handoff_process"] === "string" &&
    answers["handoff_process"].trim().length > 0 &&
    typeof answers["pipeline_friction"] === "string" &&
    answers["pipeline_friction"].trim().length > 0 &&
    typeof answers["sales_improvement"] === "string" &&
    answers["sales_improvement"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: handoff_process */}
      <MultipleChoiceQuestion
        question="How effective is your current handoff process from sales to delivery or success?"
        options={[
          { value: "no_process", label: "We don’t really have a handoff" },
          { value: "inconsistent", label: "It happens inconsistently or informally" },
          { value: "documented", label: "We have a documented handoff with key info shared" },
          { value: "well_executed", label: "It’s well executed and tracked consistently" },
        ]}
        value={answers["handoff_process"] || ""}
        onChange={(val) => onAnswer("handoff_process", val)}
      />

      {/* Question 9: pipeline_friction */}
      <TextAreaQuestion
        question="What’s the biggest friction point in your current pipeline?"
        placeholder="E.g., qualification, follow-ups, deal progression"
        value={answers["pipeline_friction"] || ""}
        onChange={(val) => onAnswer("pipeline_friction", val)}
        maxLength={300}
      />

      {/* Question 10: sales_improvement */}
      <TextAreaQuestion
        question="What’s one improvement you’d make to your sales process today?"
        placeholder="E.g., automation, coaching, process clarity"
        value={answers["sales_improvement"] || ""}
        onChange={(val) => onAnswer("sales_improvement", val)}
        maxLength={300}
      />
    </div>
  );
}
