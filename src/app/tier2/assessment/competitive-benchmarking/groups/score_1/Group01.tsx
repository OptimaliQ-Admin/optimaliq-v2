"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitive_visibility"] === "string" &&
    typeof answers["industry_tracking"] === "string" &&
    typeof answers["data_sources"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: competitive_visibility */}
      <MultipleChoiceQuestion
        question="How clear is your understanding of how your business compares to competitors?"
        options={[
          { value: "no_idea", label: "We have no idea" },
          { value: "general_idea", label: "We have a general idea" },
          { value: "some_metrics", label: "We know some basic metrics" },
          { value: "comprehensive_view", label: "We have a comprehensive view" },
        ]}
        value={answers["competitive_visibility"] || ""}
        onChange={(val) => onAnswer("competitive_visibility", val)}
      />

      {/* Question 2: industry_tracking */}
      <MultipleChoiceQuestion
        question="How frequently do you review industry or competitor performance?"
        options={[
          { value: "never", label: "Never" },
          { value: "yearly", label: "Annually or less" },
          { value: "quarterly", label: "Quarterly" },
          { value: "monthly", label: "Monthly or more often" },
        ]}
        value={answers["industry_tracking"] || ""}
        onChange={(val) => onAnswer("industry_tracking", val)}
      />

      {/* Question 3: data_sources */}
      <MultipleChoiceQuestion
        question="What data sources do you use to track competitor or market trends?"
        options={[
          { value: "none", label: "None — it’s mostly word of mouth" },
          { value: "public_reports", label: "Occasional public reports" },
          { value: "internal_sources", label: "A mix of internal and external sources" },
          { value: "dedicated_platforms", label: "Dedicated market intelligence platforms" },
        ]}
        value={answers["data_sources"] || ""}
        onChange={(val) => onAnswer("data_sources", val)}
      />
    </div>
  );
}
