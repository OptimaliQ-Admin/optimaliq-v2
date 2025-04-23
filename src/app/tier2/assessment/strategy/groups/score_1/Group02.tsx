"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategy_ownership"] === "string" &&
    typeof answers["data_in_strategy"] === "string" &&
    typeof answers["goal_setting"] === "string" &&
    typeof answers["progress_tracking"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="Who typically owns or drives strategic planning in your organization?"
        options={[
          { value: "no_one", label: "No one — we don’t really plan strategically" },
          { value: "founder_or_exec", label: "Founder or a single executive informally" },
          { value: "multiple_leaders", label: "A few key leaders collaborate on it" },
          { value: "dedicated_team", label: "A dedicated strategy or operations function" },
        ]}
        value={answers["strategy_ownership"] || ""}
        onChange={(val) => onAnswer("strategy_ownership", val)}
      />

      <MultipleChoiceQuestion
        question="How much does data influence your strategy today?"
        options={[
          { value: "none", label: "Not at all — decisions are mostly gut-driven" },
          { value: "occasional", label: "Occasionally — when it's convenient" },
          { value: "frequent", label: "Frequently — we refer to data during planning" },
          { value: "always", label: "Always — data is a foundation of strategic decisions" },
        ]}
        value={answers["data_in_strategy"] || ""}
        onChange={(val) => onAnswer("data_in_strategy", val)}
      />

      <MultipleChoiceQuestion
        question="How are your business goals usually set?"
        options={[
          { value: "ad_hoc", label: "Ad hoc or not clearly stated" },
          { value: "top_down", label: "Top-down from leadership only" },
          { value: "collaborative", label: "Collaborative with some team input" },
          { value: "aligned_across_teams", label: "Aligned across teams with shared accountability" },
        ]}
        value={answers["goal_setting"] || ""}
        onChange={(val) => onAnswer("goal_setting", val)}
      />

      <MultipleChoiceQuestion
        question="How do you track progress on your strategic goals?"
        options={[
          { value: "not_tracked", label: "They’re not really tracked" },
          { value: "occasionally_reviewed", label: "Reviewed occasionally, mostly informally" },
          { value: "shared_dashboards", label: "Tracked in shared dashboards or reports" },
          { value: "accountability_reviews", label: "Reviewed regularly with accountability check-ins" },
        ]}
        value={answers["progress_tracking"] || ""}
        onChange={(val) => onAnswer("progress_tracking", val)}
      />
    </div>
  );
}
