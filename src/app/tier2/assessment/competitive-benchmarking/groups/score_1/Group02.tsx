"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_frequency"] === "string" &&
    typeof answers["benchmarking_focus"] === "string" &&
    typeof answers["insight_quality"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: benchmarking_frequency */}
      <MultipleChoiceQuestion
        question="How often do you benchmark your performance against others in your space?"
        options={[
          { value: "never", label: "Never" },
          { value: "ad_hoc", label: "Ad hoc or occasionally" },
          { value: "annually", label: "Annually" },
          { value: "quarterly_or_more", label: "Quarterly or more often" },
        ]}
        value={answers["benchmarking_frequency"] || ""}
        onChange={(val) => onAnswer("benchmarking_frequency", val)}
      />

      {/* Question 5: benchmarking_focus */}
      <MultipleChoiceQuestion
        question="What aspects of your business are you most interested in benchmarking?"
        options={[
          { value: "not_sure", label: "Not sure" },
          { value: "marketing_sales", label: "Marketing and sales performance" },
          { value: "cx_efficiency", label: "Customer experience and operational efficiency" },
          { value: "full_stack", label: "All areas — we want a full view" },
        ]}
        value={answers["benchmarking_focus"] || ""}
        onChange={(val) => onAnswer("benchmarking_focus", val)}
      />

      {/* Question 6: insight_quality */}
      <MultipleChoiceQuestion
        question="How useful are the competitive or industry insights you currently gather?"
        options={[
          { value: "not_useful", label: "Not useful — they’re vague or outdated" },
          { value: "some_useful", label: "Somewhat useful, but inconsistent" },
          { value: "pretty_useful", label: "Pretty useful — we’ve made changes based on them" },
          { value: "very_useful", label: "Very useful — they directly inform strategy" },
        ]}
        value={answers["insight_quality"] || ""}
        onChange={(val) => onAnswer("insight_quality", val)}
      />
    </div>
  );
}
