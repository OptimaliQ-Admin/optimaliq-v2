"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["sales_org_influence"] === "string" &&
    answers["sales_org_influence"].trim().length > 0 &&
    Array.isArray(answers["future_capabilities_used"]) &&
    answers["future_capabilities_used"].length > 0 &&
    typeof answers["sales_culture_support"] === "string" &&
    answers["sales_culture_support"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  const selected = answers["future_capabilities_used"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: sales_org_influence */}
      <MultipleChoiceQuestion
        question="How does your sales org contribute to shaping company strategy?"
        options={[
          { value: "just_results", label: "Sales delivers results, but isn’t involved in strategy" },
          { value: "provides_input", label: "Sales provides input based on customer feedback" },
          { value: "collaborates", label: "Sales collaborates regularly with leadership" },
          { value: "strategic_driver", label: "Sales is a strategic driver and co-shapes roadmap" },
        ]}
        value={answers["sales_org_influence"] || ""}
        onChange={(val) => onAnswer("sales_org_influence", val)}
      />

      {/* Question 2: future_capabilities_used */}
      <MultiSelectQuestion
        question="Which of the following future-focused capabilities are part of your sales org today?"
        options={[
          { value: "ai_forecasting", label: "AI-enhanced forecasting" },
          { value: "buyer_intent", label: "Buyer intent and predictive scoring" },
          { value: "revenue_ops", label: "Revenue operations integration" },
          { value: "deal_health", label: "Deal health monitoring or alerts" },
        ]}
        selected={selected}
        onChange={(val) => onAnswer("future_capabilities_used", val)}
        maxSelect={4}
      />

      {/* Question 3: sales_culture_support */}
      <MultipleChoiceQuestion
        question="How do you ensure your sales culture supports long-term success?"
        options={[
          { value: "performance_only", label: "We focus mostly on performance outcomes" },
          { value: "limited_support", label: "Leadership shares values but reps aren’t measured on them" },
          { value: "balanced", label: "Reps are recognized for both results and behaviors" },
          { value: "integrated_model", label: "Our culture, incentives, and metrics reinforce our values" },
        ]}
        value={answers["sales_culture_support"] || ""}
        onChange={(val) => onAnswer("sales_culture_support", val)}
      />
    </div>
  );
}
