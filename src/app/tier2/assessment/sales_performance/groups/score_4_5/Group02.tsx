"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["how_15ad3d"] === "string" &&
    typeof answers["how_7e00a0"] === "string" &&
    typeof answers["what’s_2e8609"] === "string" &&
    typeof answers["what_ada360"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: how_15ad3d */}
      <MultipleChoiceQuestion
        question="How does your CRM or sales system support daily rep execution?"
        options={[
          { value: "log_only", label: "It’s used for logging activity only" },
          { value: "basic_pipeline", label: "It shows basic tasks or pipeline" },
          { value: "guided_prompts", label: "It guides reps with prompts or scoring" },
          { value: "real_time_assistant", label: "It acts as a real-time assistant with recommendations and automation" },
        ]}
        value={answers["how_15ad3d"] || ""}
        onChange={(val) => onAnswer("how_15ad3d", val)}
      />

      {/* Question 5: how_7e00a0 */}
      <MultipleChoiceQuestion
        question="How do you track and improve team-wide sales effectiveness over time?"
        options={[
          { value: "not_tracked", label: "We don’t track it systematically" },
          { value: "individual_perf", label: "Based on individual rep performance" },
          { value: "scorecards", label: "Using team-wide scorecards and dashboards" },
          { value: "patterns_and_outcomes", label: "By monitoring patterns, ramp, enablement, and buyer outcomes" },
        ]}
        value={answers["how_7e00a0"] || ""}
        onChange={(val) => onAnswer("how_7e00a0", val)}
      />

      {/* Question 6: what’s_2e8609 */}
      <MultipleChoiceQuestion
        question="What’s your process for adjusting goals or territory models in response to market changes?"
        options={[
          { value: "rarely_change", label: "We rarely change them mid-cycle" },
          { value: "informal_adjustments", label: "We adjust informally as needed" },
          { value: "quarterly_review", label: "Reviewed and realigned quarterly" },
          { value: "dynamic_modeling", label: "Adjusted dynamically with shared input and data modeling" },
        ]}
        value={answers["what’s_2e8609"] || ""}
        onChange={(val) => onAnswer("what’s_2e8609", val)}
      />

      {/* Question 7: what_ada360 */}
      <MultipleChoiceQuestion
        question="What role does sales data play in your executive planning or board reporting?"
        options={[
          { value: "top_line_only", label: "Minimal — only top-line revenue" },
          { value: "conversion_rates", label: "Basic conversion and win rates" },
          { value: "forecast_and_coverage", label: "Forecasts and pipeline coverage" },
          { value: "full_cycle", label: "Full-cycle metrics and performance models" },
        ]}
        value={answers["what_ada360"] || ""}
        onChange={(val) => onAnswer("what_ada360", val)}
      />
    </div>
  );
}
