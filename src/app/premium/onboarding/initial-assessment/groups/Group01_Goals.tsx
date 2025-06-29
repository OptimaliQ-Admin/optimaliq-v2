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
        description="Choose the KPIs that guide your key decisions today. Select up to 5 that matter most to your business."
        options={[
          { 
            value: "revenue", 
            label: "Revenue", 
            description: "Total sales and income"
          },
          { 
            value: "profit_margin", 
            label: "Profit Margin", 
            description: "Net profit as percentage of revenue"
          },
          { 
            value: "customer_ltv", 
            label: "Customer Lifetime Value (LTV)", 
            description: "Total value a customer brings over time"
          },
          { 
            value: "customer_acquisition_cost", 
            label: "Customer Acquisition Cost (CAC)", 
            description: "Cost to acquire a new customer"
          },
          { 
            value: "churn_rate", 
            label: "Customer Churn Rate", 
            description: "Percentage of customers who leave"
          },
          { 
            value: "retention_rate", 
            label: "Customer Retention Rate", 
            description: "Percentage of customers who stay"
          },
          { 
            value: "conversion_rate", 
            label: "Conversion Rate", 
            description: "Percentage of visitors who become customers"
          },
          { 
            value: "traffic", 
            label: "Website or App Traffic", 
            description: "Number of visitors to your platform"
          },
          { 
            value: "active_users", 
            label: "Monthly Active Users (MAU)", 
            description: "Users who engage with your product monthly"
          },
          { 
            value: "net_promoter_score", 
            label: "Net Promoter Score (NPS)", 
            description: "Customer satisfaction and loyalty metric"
          },
          { 
            value: "other", 
            label: "Other (please describe)", 
            description: "Custom metrics specific to your business"
          },
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
          placeholder="Describe any additional metrics you use to measure growth..."
          value={getStringAnswer(answers["growth_metrics_other"])}
          onChange={(val) => onAnswer("growth_metrics_other", val)}
          maxLength={100}
          rows={3}
        />
      )}

      {/* Question 2: Go-To-Market Strategy */}
      <EnhancedTextAreaQuestion
        question="In one or two sentences, describe your go-to-market strategy."
        description="How do you attract, convert, and retain customers? Be specific about your channels and approach."
        placeholder="E.g., We drive traffic through paid and organic channels and convert through personalized onboarding flows..."
        value={getStringAnswer(answers["gtm_strategy"])}
        onChange={(val) => onAnswer("gtm_strategy", val)}
        maxLength={300}
        rows={4}
      />

      {/* Question 3: Friction Points */}
      <EnhancedMultiSelectQuestion
        question="What are the biggest friction points actively holding your business back?"
        description="Select up to 3 challenges that are most critical to address right now."
        options={[
          { 
            value: "lack_funding", 
            label: "Lack of funding", 
            description: "Insufficient capital for growth initiatives"
          },
          { 
            value: "leadership_misalignment", 
            label: "Leadership misalignment", 
            description: "Team not aligned on strategy or priorities"
          },
          { 
            value: "hiring_retention", 
            label: "Hiring or retention challenges", 
            description: "Difficulty finding or keeping talent"
          },
          { 
            value: "operational_inefficiencies", 
            label: "Operational inefficiencies", 
            description: "Processes slowing down growth"
          },
          { 
            value: "underperforming_marketing", 
            label: "Underperforming marketing", 
            description: "Marketing efforts not driving results"
          },
          { 
            value: "high_cac", 
            label: "High customer acquisition cost", 
            description: "Cost to acquire customers is too high"
          },
          { 
            value: "weak_retention", 
            label: "Weak customer retention", 
            description: "Customers leaving too quickly"
          },
          { 
            value: "tech_stack_issues", 
            label: "Tech stack limitations", 
            description: "Technology holding back growth"
          },
          { 
            value: "brand_positioning", 
            label: "Undefined brand positioning", 
            description: "Unclear market position or messaging"
          },
          { 
            value: "market_saturation", 
            label: "Market saturation", 
            description: "Competition making growth difficult"
          },
          { 
            value: "regulatory_issues", 
            label: "Regulatory or compliance issues", 
            description: "Legal or compliance challenges"
          },
          { 
            value: "other", 
            label: "Other (please describe)", 
            description: "Other challenges specific to your business"
          },
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
          placeholder="E.g., Internal delays, market confusion, etc."
          value={getStringAnswer(answers["friction_points_other"])}
          onChange={(val) => onAnswer("friction_points_other", val)}
          maxLength={100}
          rows={3}
        />
      )}
    </div>
  );
}
