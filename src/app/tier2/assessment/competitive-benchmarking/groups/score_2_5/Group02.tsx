"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_consistency"] === "string" &&
    typeof answers["review_frequency"] === "string" &&
    typeof answers["insight_application"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: benchmarking_consistency */}
      <MultipleChoiceQuestion
        question="How consistent are your benchmarking efforts across different departments or functions?"
        options={[
          { value: "no_consistency", label: "There’s no consistency — it’s informal and ad hoc" },
          { value: "some_functions", label: "Some functions do it, others don’t" },
          { value: "most_functions", label: "Most teams use it regularly" },
          { value: "fully_integrated", label: "It’s a fully integrated part of how we operate" },
        ]}
        value={answers["benchmarking_consistency"] || ""}
        onChange={(val) => onAnswer("benchmarking_consistency", val)}
      />

      {/* Question 5: review_frequency */}
      <MultipleChoiceQuestion
        question="How often do you review and update your benchmarks?"
        options={[
          { value: "almost_never", label: "Almost never — we set them and forget them" },
          { value: "occasionally", label: "Occasionally — when we feel behind or something changes" },
          { value: "annually", label: "Annually or during strategic planning" },
          { value: "quarterly_or_more", label: "Quarterly or more frequently" },
        ]}
        value={answers["review_frequency"] || ""}
        onChange={(val) => onAnswer("review_frequency", val)}
      />

      {/* Question 6: insight_application */}
      <MultipleChoiceQuestion
        question="What do you do with the insights from your benchmarking efforts?"
        options={[
          { value: "not_applied", label: "We don’t really apply them" },
          { value: "used_in_presentations", label: "We use them in reports or presentations" },
          { value: "sometimes_influences", label: "They sometimes influence strategic decisions" },
          { value: "integrated_into_strategy", label: "They directly shape priorities and roadmaps" },
        ]}
        value={answers["insight_application"] || ""}
        onChange={(val) => onAnswer("insight_application", val)}
      />
    </div>
  );
}
