"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_strategy"] === "string" &&
    typeof answers["benchmarking_scope"] === "string" &&
    typeof answers["competitive_positioning"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: benchmarking_strategy */}
      <MultipleChoiceQuestion
        question="How integrated is benchmarking in your growth strategy?"
        options={[
          { value: "not_incorporated", label: "Not really incorporated" },
          { value: "occasional_reference", label: "We occasionally reference it" },
          { value: "routine_monitoring", label: "It’s routinely monitored" },
          { value: "embedded_strategy", label: "It’s embedded in strategic planning" },
        ]}
        value={answers["benchmarking_strategy"] || ""}
        onChange={(val) => onAnswer("benchmarking_strategy", val)}
      />

      {/* Question 2: benchmarking_scope */}
      <MultipleChoiceQuestion
        question="How broad is your benchmarking scope?"
        options={[
          { value: "narrow_scope", label: "We compare against one or two competitors" },
          { value: "industry_average", label: "We compare against industry averages" },
          { value: "multiple_competitors", label: "We compare across multiple competitors" },
          { value: "global_and_local", label: "We benchmark against global and local leaders" },
        ]}
        value={answers["benchmarking_scope"] || ""}
        onChange={(val) => onAnswer("benchmarking_scope", val)}
      />

      {/* Question 3: competitive_positioning */}
      <MultipleChoiceQuestion
        question="How clearly do you understand your positioning compared to competitors?"
        options={[
          { value: "no_clarity", label: "We don’t have a clear picture" },
          { value: "general_idea", label: "We have a general idea" },
          { value: "differentiated_messaging", label: "We highlight key differences in messaging" },
          { value: "data_backed_positioning", label: "We use data-backed messaging to differentiate" },
        ]}
        value={answers["competitive_positioning"] || ""}
        onChange={(val) => onAnswer("competitive_positioning", val)}
      />
    </div>
  );
}
