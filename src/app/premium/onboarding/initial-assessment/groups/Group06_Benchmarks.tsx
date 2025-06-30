//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group06_Benchmarks.tsx
"use client";

import React from "react";
import EnhancedMultiSelectQuestion from "@/components/questions/EnhancedMultiSelectQuestion";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";

export function isGroup06Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["benchmark_preferences"]) &&
    answers["benchmark_preferences"].length > 0 &&
    typeof answers["funding_status"] === "string" &&
    answers["funding_status"].trim().length > 0 &&
    typeof answers["growth_pace"] === "string" &&
    answers["growth_pace"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group06_Benchmarks({ answers, onAnswer }: Props) {
  const benchmarkSelected = answers["benchmark_preferences"] || [];
  const fundingSelected = answers["funding_status"] || [];
  
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Insights & Benchmarks */}
      <EnhancedMultiSelectQuestion
        question="What type of insights or benchmarks would be most valuable to you right now?"
        description="Select all that apply. This helps us prioritize the most relevant insights for your business."
        options={[
          { value: "competitor_comparison", label: "Competitor comparison", description: "How you stack up against competitors" },
          { value: "revenue_growth", label: "Revenue growth levers", description: "Strategies to accelerate revenue" },
          { value: "retention", label: "Retention improvements", description: "Ways to reduce churn and increase loyalty" },
          { value: "efficiency", label: "Operational efficiency plays", description: "Process optimization opportunities" },
          { value: "industry_best_practices", label: "Industry best practices", description: "Proven strategies from your industry" },
          { value: "automation", label: "Process automation opportunities", description: "Tasks that can be automated" },
          { value: "tech_stack", label: "Tech stack recommendations", description: "Technology optimization suggestions" },
          { value: "funnel_analysis", label: "Marketing & sales funnel analysis", description: "Conversion optimization insights" },
          { value: "other", label: "Other", description: "Unique insights specific to your business" },
        ]}
        selected={Array.isArray(benchmarkSelected) ? benchmarkSelected : []}
        onChange={(val) => onAnswer("benchmark_preferences", val)}
        maxSelect={6}
        variant="cards"
      />

      {/* Conditionally show "Other" field */}
      {Array.isArray(benchmarkSelected) && benchmarkSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the other insights or benchmarks"
          description="Tell us about any specific insights or benchmarks that would be valuable for your business."
          placeholder="Describe any additional insights or benchmarks..."
          value={getStringAnswer(answers["benchmark_preferences_other"])}
          onChange={(val) => onAnswer("benchmark_preferences_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 2: Capital/Funding Status */}
      <EnhancedMultipleChoiceQuestion
        question="Are you currently raising capital or preparing for an exit?"
        description="This helps us understand your current business stage and strategic priorities."
        options={[
          { 
            value: "raising_now", 
            label: "Yes, actively raising", 
            description: "Currently in fundraising mode" 
          },
          { 
            value: "early_planning", 
            label: "In early planning stages", 
            description: "Considering fundraising in the near future" 
          },
          { 
            value: "preparing_exit", 
            label: "Preparing for acquisition or sale", 
            description: "Planning for exit or acquisition" 
          },
          { 
            value: "not_planned", 
            label: "No, not on the roadmap", 
            description: "Focusing on organic growth" 
          },
          { 
            value: "other", 
            label: "Other", 
            description: "Unique funding or exit situation" 
          },
        ]}
        value={typeof fundingSelected === "string" ? fundingSelected : ""}
        onChange={(val) => onAnswer("funding_status", val)}
        variant="cards"
      />

      {/* Conditionally show "Other" field */}
      {typeof fundingSelected === "string" && fundingSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the other ways you are currently raising capital or preparing for an exit"
          description="Help us understand your unique funding or exit situation."
          placeholder="Describe any how you are preparing..."
          value={getStringAnswer(answers["funding_status_other"])}
          onChange={(val) => onAnswer("funding_status_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 3: Growth Pace */}
      <EnhancedMultipleChoiceQuestion
        question="What is your ideal pace of growth?"
        description="This helps us understand your growth ambitions and set appropriate benchmarks."
        options={[
          { 
            value: "10_25", 
            label: "10–25% YoY", 
            description: "Steady, sustainable growth" 
          },
          { 
            value: "25_50", 
            label: "25–50% YoY", 
            description: "Moderate acceleration" 
          },
          { 
            value: "50_100", 
            label: "50–100% YoY", 
            description: "Fast growth trajectory" 
          },
          { 
            value: "2x_3x", 
            label: "2x–3x", 
            description: "Rapid scaling" 
          },
          { 
            value: "3x_plus", 
            label: "3x+", 
            description: "Hypergrowth mode" 
          },
          { 
            value: "unsure", 
            label: "Unsure", 
            description: "Still determining growth targets" 
          },
        ]}
        value={getStringAnswer(answers["growth_pace"])}
        onChange={(val) => onAnswer("growth_pace", val)}
        variant="cards"
      />
    </div>
  );
}
