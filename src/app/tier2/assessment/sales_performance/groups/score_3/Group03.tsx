"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["sales_marketing_alignment"] === "string" &&
    answers["sales_marketing_alignment"].trim().length > 0 &&
    typeof answers["pipeline_strength"] === "string" &&
    answers["pipeline_strength"].trim().length > 0 &&
    typeof answers["scalability_readiness"] === "string" &&
    answers["scalability_readiness"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: sales_marketing_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your sales process with marketing efforts and lead generation?"
        options={[
          { value: "not_aligned", label: "Not aligned — we operate independently" },
          { value: "some_overlap", label: "Some overlap, but we don’t collaborate much" },
          { value: "shared_insights", label: "We share insights and meet occasionally" },
          { value: "fully_aligned", label: "Fully aligned with shared goals and reporting" },
        ]}
        value={answers["sales_marketing_alignment"] || ""}
        onChange={(val) => onAnswer("sales_marketing_alignment", val)}
      />

      {/* Question 9: pipeline_strength */}
      <TextAreaQuestion
        question="What’s one part of your pipeline that’s working well or stands out as a strength?"
        placeholder="E.g., discovery process, win rate, closing discipline"
        value={answers["pipeline_strength"] || ""}
        onChange={(val) => onAnswer("pipeline_strength", val)}
        maxLength={300}
      />

      {/* Question 10: scalability_readiness */}
      <MultipleChoiceQuestion
        question="How prepared is your team to scale sales across new regions, reps, or segments?"
        options={[
          { value: "not_ready", label: "Not ready — we’re still refining" },
          { value: "repeatable_processes", label: "We have repeatable processes in place" },
          { value: "enablement_ready", label: "We’re set up with enablement and training" },
          { value: "ready_to_scale", label: "We’re ready to scale with confidence" },
        ]}
        value={answers["scalability_readiness"] || ""}
        onChange={(val) => onAnswer("scalability_readiness", val)}
      />
    </div>
  );
}
