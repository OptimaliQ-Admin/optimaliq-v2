"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["value_positioning_strength"] === "string" &&
    typeof answers["competitive_landscape_tracking"] === "string" &&
    typeof answers["benchmarking_data_accuracy"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: value_positioning_strength */}
      <MultipleChoiceQuestion
        question="How strong is your value proposition compared to competitors?"
        options={[
          { value: "unclear", label: "Unclear — not consistently communicated" },
          { value: "somewhat_clear", label: "Somewhat clear — depends on the audience" },
          { value: "clear_and_compelling", label: "Clear and compelling in most sales/marketing" },
          { value: "distinctive_advantage", label: "Clearly differentiated and hard to replicate" },
        ]}
        value={answers["value_positioning_strength"] || ""}
        onChange={(val) => onAnswer("value_positioning_strength", val)}
      />

      {/* Question 9: competitive_landscape_tracking */}
      <MultipleChoiceQuestion
        question="How do you stay updated on changes in your competitive landscape?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — we react when something comes up" },
          { value: "team_discussions", label: "Team discussions or anecdotal updates" },
          { value: "structured_reports", label: "Structured reports or briefings" },
          { value: "dedicated_monitoring", label: "Dedicated monitoring and real-time feeds" },
        ]}
        value={answers["competitive_landscape_tracking"] || ""}
        onChange={(val) => onAnswer("competitive_landscape_tracking", val)}
      />

      {/* Question 10: benchmarking_data_accuracy */}
      <MultipleChoiceQuestion
        question="How accurate is the competitive or benchmarking data you rely on?"
        options={[
          { value: "not_sure", label: "Not sure — we don’t validate it" },
          { value: "mixed_accuracy", label: "Some is reliable, some outdated or vague" },
          { value: "generally_accurate", label: "Generally accurate — updated occasionally" },
          { value: "real_time_insights", label: "Very accurate — real-time insights and tools" },
        ]}
        value={answers["benchmarking_data_accuracy"] || ""}
        onChange={(val) => onAnswer("benchmarking_data_accuracy", val)}
      />
    </div>
  );
}
