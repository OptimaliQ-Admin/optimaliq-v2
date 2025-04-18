"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["bottlenecks"]) &&
    answers["bottlenecks"].length > 0 &&
    typeof answers["pipeline_challenge"] === "string" &&
    answers["pipeline_challenge"].trim().length > 0 &&
    typeof answers["lead_reengagement"] === "string" &&
    answers["lead_reengagement"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  const bottlenecks = answers["bottlenecks"] || [];

  return (
    <div className="space-y-10">

      {/* Question 8: bottlenecks */}
      <MultiSelectQuestion
        question="Which of the following bottlenecks do you encounter most often in your sales process?"
        options={[
          { value: "cold_leads", label: "Leads go cold" },
          { value: "ghosting", label: "Prospects ghost after demos or proposals" },
          { value: "slow_response", label: "Slow internal follow-up" },
          { value: "pricing_pushback", label: "Pricing objections stall deals" },
          { value: "no_decision", label: "Deals die from no decision" },
        ]}
        selected={bottlenecks}
        onChange={(val) => onAnswer("bottlenecks", val)}
        maxSelect={5}
      />

      {/* Question 9: pipeline_challenge */}
      <TextAreaQuestion
        question="What’s one part of your pipeline that feels unclear or out of sync?"
        placeholder="E.g., qualification, handoffs, or late-stage follow-ups"
        value={answers["pipeline_challenge"] || ""}
        onChange={(val) => onAnswer("pipeline_challenge", val)}
        maxLength={300}
      />

      {/* Question 10: lead_reengagement */}
      <MultipleChoiceQuestion
        question="How do you handle leads that don’t convert right away?"
        options={[
          { value: "no_follow_up", label: "We don’t follow up" },
          { value: "manual_reach_out", label: "We manually reach out after some time" },
          { value: "automated_nurture", label: "We use automated nurture campaigns" },
          { value: "long_term_sequence", label: "We have a structured long-term sequence" },
        ]}
        value={answers["lead_reengagement"] || ""}
        onChange={(val) => onAnswer("lead_reengagement", val)}
      />
    </div>
  );
}
