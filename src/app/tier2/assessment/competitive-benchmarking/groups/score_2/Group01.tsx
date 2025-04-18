"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitor_selection"] === "string" &&
    Array.isArray(answers["comparison_metrics"]) && answers["comparison_metrics"].length > 0 &&
    typeof answers["data_collection_method"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  const metricsSelected = answers["comparison_metrics"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: competitor_selection */}
      <MultipleChoiceQuestion
        question="How do you identify which competitors to benchmark against?"
        options={[
          { value: "dont_benchmark", label: "We don’t benchmark competitors" },
          { value: "occasionally_review", label: "We occasionally review similar companies" },
          { value: "direct_competitors", label: "We focus on direct competitors in our space" },
          { value: "broad_market_leaders", label: "We also look at broader market leaders and disruptors" },
        ]}
        value={answers["competitor_selection"] || ""}
        onChange={(val) => onAnswer("competitor_selection", val)}
      />

      {/* Question 2: comparison_metrics */}
      <MultiSelectQuestion
        question="What metrics do you typically use to compare against competitors?"
        options={[
          { value: "revenue_growth", label: "Revenue or growth rate" },
          { value: "pricing_strategy", label: "Pricing or packaging" },
          { value: "product_features", label: "Product features or innovation" },
          { value: "marketing_presence", label: "Marketing spend or brand presence" },
          { value: "customer_feedback", label: "Customer sentiment or reviews" },
        ]}
        selected={metricsSelected}
        onChange={(val) => onAnswer("comparison_metrics", val)}
        maxSelect={5}
      />

      {/* Question 3: data_collection_method */}
      <MultipleChoiceQuestion
        question="How do you collect data about competitors today?"
        options={[
          { value: "no_data", label: "We don’t collect competitive data" },
          { value: "manual_reviews", label: "We review websites or news manually" },
          { value: "some_tools", label: "We use basic research tools or alerts" },
          { value: "dedicated_platforms", label: "We have dedicated tools or subscriptions" },
        ]}
        value={answers["data_collection_method"] || ""}
        onChange={(val) => onAnswer("data_collection_method", val)}
      />
    </div>
  );
}
