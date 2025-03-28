"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group01_Goals({ answers, onAnswer }: Props) {
  return (
<div className="p-6 max-w-2xl mx-auto">
      <MultipleChoiceQuestion
        question="What is your company’s #1 growth objective for the next 12 months?"
        description="Pick the one that most accurately reflects your true north."
        options={[
          { value: "increase_revenue", label: "Increase Revenue" },
          { value: "improve_profitability", label: "Improve Profitability" },
          { value: "scale_operations", label: "Scale Operations" },
          { value: "expand_new_markets", label: "Expand into New Markets" },
          { value: "launch_new_product", label: "Launch a New Product or Service" },
          { value: "improve_retention", label: "Improve Customer Retention" },
          { value: "raise_funding", label: "Raise Capital or Funding" },
          { value: "prepare_exit", label: "Prepare for Acquisition or Exit" },
          { value: "other", label: "Other (please describe)" },
        ]}
        value={answers["growth_objective"] || ""}
        onChange={(val) => onAnswer("growth_objective", val)}
      />
    </div>

      {/* Question 2: Go-To-Market Strategy */}
      <TextAreaQuestion
        question="In one or two sentences, describe your go-to-market strategy."
        description="How do you attract, convert, and retain customers?"
        placeholder="E.g., We drive traffic through paid and organic channels and convert through personalized onboarding flows..."
        value={answers["gtm_strategy"] || ""}
        onChange={(val) => onAnswer("gtm_strategy", val)}
      />

      {/* Question 3: Friction Points */}
      <MultiSelectQuestion
  question="What are the biggest friction points actively holding your business back?"
  description="Select up to 3"
  options={[
    { value: "lack_funding", label: "Lack of funding" },
    { value: "leadership_misalignment", label: "Leadership misalignment" },
    { value: "hiring_retention", label: "Hiring or retention challenges" },
    { value: "operational_inefficiencies", label: "Operational inefficiencies" },
    { value: "underperforming_marketing", label: "Underperforming marketing" },
    { value: "high_cac", label: "High customer acquisition cost" },
    { value: "weak_retention", label: "Weak customer retention" },
    { value: "tech_stack_issues", label: "Tech stack limitations or fragmentation" },
    { value: "brand_positioning", label: "Undefined or inconsistent brand positioning" },
    { value: "market_saturation", label: "Market saturation" },
    { value: "regulatory_issues", label: "Regulatory or compliance issues" },
    { value: "other", label: "Other (please describe)" },
  ]}
  maxSelect={3}
  selected={answers["friction_points"] || []}
  onChange={(val) => onAnswer("friction_points", val)}
/>

    </div>
  );
}
