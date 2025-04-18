"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["sales_transformation"] === "string" &&
    answers["sales_transformation"].trim().length > 0 &&
    typeof answers["buyer_behavior_action"] === "string" &&
    answers["buyer_behavior_action"].trim().length > 0 &&
    typeof answers["strategic_bets"] === "string" &&
    answers["strategic_bets"].trim().length > 0 &&
    typeof answers["tool_support"] === "string" &&
    answers["tool_support"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: sales_transformation */}
      <TextAreaQuestion
        question="What’s one transformational change your sales org has made in the last year?"
        placeholder="E.g., RevOps centralization, ICP refinement, AI rollout"
        value={answers["sales_transformation"] || ""}
        onChange={(val) => onAnswer("sales_transformation", val)}
        maxLength={300}
      />

      {/* Question 5: buyer_behavior_action */}
      <MultipleChoiceQuestion
        question="How does your team capture and act on buyer behavior signals?"
        options={[
          { value: "not_tracked", label: "We don’t track it consistently" },
          { value: "review_only", label: "We review intent data or call recordings" },
          { value: "adjust_tactics", label: "We adjust messaging and outreach accordingly" },
          { value: "trigger_workflows", label: "We trigger workflows or cadences automatically" },
        ]}
        value={answers["buyer_behavior_action"] || ""}
        onChange={(val) => onAnswer("buyer_behavior_action", val)}
      />

      {/* Question 6: strategic_bets */}
      <MultipleChoiceQuestion
        question="How do you manage strategic sales bets (new verticals, pricing, messaging)?"
        options={[
          { value: "launch_and_hope", label: "We launch and hope" },
          { value: "pilot_only", label: "We test pilots and gather feedback" },
          { value: "score_and_scale", label: "We score experiments and scale what works" },
          { value: "iterative_modeling", label: "We use an iterative model to de-risk bets" },
        ]}
        value={answers["strategic_bets"] || ""}
        onChange={(val) => onAnswer("strategic_bets", val)}
      />

      {/* Question 7: tool_support */}
      <MultipleChoiceQuestion
        question="How are your sales tools and systems helping reps close more effectively?"
        options={[
          { value: "activity_tracking_only", label: "They’re mostly for tracking activity" },
          { value: "some_coaching", label: "They help identify coaching moments" },
          { value: "rep_productivity", label: "They support rep productivity and follow-up" },
          { value: "real_time_guidance", label: "They provide real-time deal and buyer guidance" },
        ]}
        value={answers["tool_support"] || ""}
        onChange={(val) => onAnswer("tool_support", val)}
      />
    </div>
  );
}
