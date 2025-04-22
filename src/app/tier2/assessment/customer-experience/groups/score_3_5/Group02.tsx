"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_goal_alignment"] === "string" &&
    typeof answers["cx_strategy_adaptation"] === "string" &&
    typeof answers["cx_team_enablement"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      {/* Question 8: cx_goal_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your CX efforts with broader company goals?"
        options={[
          { value: "not_aligned", label: "Not aligned — it feels like a separate effort" },
          { value: "somewhat_aligned", label: "Somewhat aligned — we try to connect initiatives" },
          { value: "mostly_aligned", label: "Mostly aligned — key metrics are tied to goals" },
          { value: "fully_aligned", label: "Fully aligned and measured against company OKRs" },
        ]}
        value={answers["cx_goal_alignment"] || ""}
        onChange={(val) => onAnswer("cx_goal_alignment", val)}
      />

      {/* Question 9: cx_strategy_adaptation */}
      <MultipleChoiceQuestion
        question="How often is your customer experience strategy revisited or adapted?"
        options={[
          { value: "rarely", label: "Rarely — it’s static" },
          { value: "annually", label: "Annually — during planning cycles" },
          { value: "quarterly", label: "Quarterly — tied to key results" },
          { value: "ongoing", label: "Ongoing — we optimize based on live data" },
        ]}
        value={answers["cx_strategy_adaptation"] || ""}
        onChange={(val) => onAnswer("cx_strategy_adaptation", val)}
      />

      {/* Question 10: cx_team_enablement */}
      <MultipleChoiceQuestion
        question="How would you rate your team’s ability to act on customer feedback or needs?"
        options={[
          { value: "low", label: "Low — feedback gets lost or ignored" },
          { value: "inconsistent", label: "Inconsistent — depends on who sees it" },
          { value: "proactive", label: "Proactive — we act on patterns and themes" },
          { value: "empowered", label: "Empowered — teams are equipped to make changes quickly" },
        ]}
        value={answers["cx_team_enablement"] || ""}
        onChange={(val) => onAnswer("cx_team_enablement", val)}
      />
    </div>
  );
}
