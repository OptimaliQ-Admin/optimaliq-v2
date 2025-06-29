"use client";

import React from "react";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";
import EnhancedMultiSelectQuestion from "@/components/questions/EnhancedMultiSelectQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

// ✅ Validation function
export function isGroup01Complete(answers: AssessmentAnswers): boolean {
  const hasGrowthMetrics =
    Array.isArray(answers["growth_metrics"]) &&
    answers["growth_metrics"].length > 0;

  const hasGTMStrategy =
    typeof answers["gtm_strategy"] === "string" &&
    answers["gtm_strategy"].trim().length > 0;

  const hasFrictionPoints =
    Array.isArray(answers["friction_points"]) &&
    answers["friction_points"].length > 0;

  return hasGrowthMetrics && hasGTMStrategy && hasFrictionPoints;
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group01_Goals({ answers, onAnswer }: Props) {
  const growthSelected = Array.isArray(answers["growth_metrics"])
    ? answers["growth_metrics"]
    : [];

  const frictionSelected = Array.isArray(answers["friction_points"])
    ? answers["friction_points"]
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question 1: Growth Metrics */}
      <EnhancedMultiSelectQuestion
        question="What metrics do you track most closely to measure growth?"
        description="Choose the KPIs that guide your key decisions today. These metrics help us understand your current focus and optimization priorities."
        options={[
          { value: "revenue", label: "Revenue", description: "Total sales and income" },
          { value: "profit_margin", label: "Profit Margin", description: "Net profit as percentage of revenue" },
          { value: "customer_ltv", label: "Customer Lifetime Value (LTV)", description: "Total value a customer brings over time" },
          { value: "customer_acquisition_cost", label: "Customer Acquisition Cost (CAC)", description: "Cost to acquire a new customer" },
          { value: "churn_rate", label: "Customer Churn Rate", description: "Rate at which customers leave" },
          { value: "retention_rate", label: "Customer Retention Rate", description: "Rate at which customers stay" },
          { value: "conversion_rate", label: "Conversion Rate", description: "Percentage of visitors who become customers" },
          { value: "traffic", label: "Website or App Traffic", description: "Number of visitors to your platform" },
          { value: "active_users", label: "Monthly Active Users (MAU)", description: "Users engaging with your product monthly" },
          { value: "net_promoter_score", label: "Net Promoter Score (NPS)", description: "Customer satisfaction and loyalty metric" },
          { value: "other", label: "Other", description: "Custom metrics specific to your business" },
        ]}
        selected={growthSelected}
        onChange={(val) => onAnswer("growth_metrics", val)}
        maxSelect={5}
        variant="cards"
      />

      {/* Conditionally show "Other" field for growth_metrics */}
      {growthSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the other metric(s) you track"
          description="Tell us about any custom or industry-specific metrics that are crucial to your business."
          placeholder="Describe any additional metrics you use to measure growth..."
          value={getStringAnswer(answers["growth_metrics_other"])}
          onChange={(val) => onAnswer("growth_metrics_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 2: Go-To-Market Strategy */}
      <EnhancedTextAreaQuestion
        question="In one or two sentences, describe your go-to-market strategy."
        description="How do you attract, convert, and retain customers? This helps us understand your current market approach and identify optimization opportunities."
        placeholder="E.g., We drive traffic through paid and organic channels and convert through personalized onboarding flows..."
        value={getStringAnswer(answers["gtm_strategy"])}
        onChange={(val) => onAnswer("gtm_strategy", val)}
        maxLength={300}
        rows={4}
      />

      {/* Question 3: Friction Points */}
      <EnhancedMultiSelectQuestion
        question="What are the biggest friction points actively holding your business back?"
        description="Select up to 3 areas where you're experiencing the most significant challenges or bottlenecks."
        options={[
          { value: "lack_funding", label: "Lack of funding", description: "Insufficient capital for growth initiatives" },
          { value: "leadership_misalignment", label: "Leadership misalignment", description: "Conflicting priorities or vision among leaders" },
          { value: "hiring_retention", label: "Hiring or retention challenges", description: "Difficulty finding or keeping key talent" },
          { value: "operational_inefficiencies", label: "Operational inefficiencies", description: "Process bottlenecks or workflow issues" },
          { value: "underperforming_marketing", label: "Underperforming marketing", description: "Low ROI on marketing spend or poor conversion" },
          { value: "high_cac", label: "High customer acquisition cost", description: "Expensive customer acquisition relative to LTV" },
          { value: "weak_retention", label: "Weak customer retention", description: "High churn or low customer loyalty" },
          { value: "tech_stack_issues", label: "Tech stack limitations", description: "Technology constraints or integration problems" },
          { value: "brand_positioning", label: "Undefined brand positioning", description: "Unclear market differentiation or messaging" },
          { value: "market_saturation", label: "Market saturation", description: "Intense competition or limited market opportunity" },
          { value: "regulatory_issues", label: "Regulatory or compliance issues", description: "Legal or compliance challenges" },
          { value: "other", label: "Other", description: "Unique challenges specific to your business" },
        ]}
        selected={frictionSelected}
        onChange={(val) => onAnswer("friction_points", val)}
        maxSelect={3}
        variant="cards"
      />

      {/* Conditionally show "Other" field for friction_points */}
      {frictionSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the other friction point(s)"
          description="Help us understand any unique challenges that might not fit the standard categories."
          placeholder="E.g., Internal delays, market confusion, specific industry challenges, etc."
          value={getStringAnswer(answers["friction_points_other"])}
          onChange={(val) => onAnswer("friction_points_other", val)}
          maxLength={200}
          rows={3}
        />
      )}
    </div>
  );
}
