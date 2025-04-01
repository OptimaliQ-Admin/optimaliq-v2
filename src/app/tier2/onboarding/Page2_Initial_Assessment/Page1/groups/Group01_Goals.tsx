"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";


export function isGroup01Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["growth_metrics"]) && answers["growth_metrics"].length > 0 &&
    typeof answers["gtm_strategy"] === "string" && answers["gtm_strategy"].trim().length > 0 &&
    Array.isArray(answers["friction_points"]) && answers["friction_points"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group01_Goals({ answers, onAnswer }: Props) {
  return (
<div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: Growth Metrics */}
<MultiSelectQuestion
  question="What metrics do you track most closely to measure growth?"
  description="Choose the KPIs that guide your key decisions today."
  options={[
    { value: "revenue", label: "Revenue" },
    { value: "profit_margin", label: "Profit Margin" },
    { value: "customer_ltv", label: "Customer Lifetime Value (LTV)" },
    { value: "customer_acquisition_cost", label: "Customer Acquisition Cost (CAC)" },
    { value: "churn_rate", label: "Customer Churn Rate" },
    { value: "retention_rate", label: "Customer Retention Rate" },
    { value: "conversion_rate", label: "Conversion Rate" },
    { value: "traffic", label: "Website or App Traffic" },
    { value: "active_users", label: "Monthly Active Users (MAU)" },
    { value: "net_promoter_score", label: "Net Promoter Score (NPS)" },
    { value: "other", label: "Other (please describe)" },
  ]}
  selected={answers["growth_metrics"] || []}
  onChange={(val) => onAnswer("growth_metrics", val)}
  maxSelect={5}
/>

{/* Conditionally show "Other" field */}
{(answers["growth_metrics"] || []).includes("other") && (
  <TextAreaQuestion
    question="Please describe the other metric(s) you track"
    placeholder="Describe any additional metrics you use to measure growth..."
    value={answers["growth_metrics_other"] || ""}
    onChange={(val) => onAnswer("growth_metrics_other", val)}
    maxLength={50}
  />
)}

      {/* Question 2: Go-To-Market Strategy */}
      <TextAreaQuestion
        question="In one or two sentences, describe your go-to-market strategy."
        description="How do you attract, convert, and retain customers?"
        placeholder="E.g., We drive traffic through paid and organic channels and convert through personalized onboarding flows..."
        value={answers["gtm_strategy"] || ""}
        onChange={(val) => onAnswer("gtm_strategy", val)}
        maxLength={300}
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
        selected={Array.isArray(answers["friction_points"]) ? answers["friction_points"] : []}
  onChange={(val) => onAnswer("friction_points", val)}
      />
    </div>
  );
}
