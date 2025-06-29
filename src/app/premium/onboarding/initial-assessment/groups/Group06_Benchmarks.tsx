//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group06_Benchmarks.tsx
"use client";

import React from "react";
import EnhancedMultiSelectQuestion from "@/components/questions/EnhancedMultiSelectQuestion";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

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
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Question 16: Insights & Benchmarks */}
      <EnhancedMultiSelectQuestion
        question="What type of insights or benchmarks would be most valuable to you right now?"
        description="Select all that apply. These help us tailor your dashboard and recommendations."
        options={[
          { value: "competitor_comparison", label: "Competitor comparison", description: "How you stack up against competitors" },
          { value: "revenue_growth", label: "Revenue growth levers", description: "Strategies to accelerate revenue" },
          { value: "retention", label: "Retention improvements", description: "Ways to keep customers longer" },
          { value: "efficiency", label: "Operational efficiency plays", description: "Process and cost improvements" },
          { value: "industry_best_practices", label: "Industry best practices", description: "What top performers do" },
          { value: "automation", label: "Process automation opportunities", description: "Where to automate for scale" },
          { value: "tech_stack", label: "Tech stack recommendations", description: "Tools and platforms to consider" },
          { value: "funnel_analysis", label: "Marketing & sales funnel analysis", description: "Where you lose or convert customers" },
          { value: "other", label: "Other (please describe)", description: "Custom insights or benchmarks" },
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
          placeholder="Describe any additional insights or benchmarks..."
          value={getStringAnswer(answers["benchmark_preferences_other"])}
          onChange={(val) => onAnswer("benchmark_preferences_other", val)}
          maxLength={100}
          rows={3}
        />
      )}

      {/* Question 17: Capital/Funding Status */}
      <EnhancedMultipleChoiceQuestion
        question="Are you currently raising capital or preparing for an exit?"
        description="Let us know your current funding or exit plans."
        options={[
          { value: "raising_now", label: "Yes, actively raising", description: "Currently seeking investment" },
          { value: "early_planning", label: "In early planning stages", description: "Considering raising or exit soon" },
          { value: "preparing_exit", label: "Preparing for acquisition or sale", description: "Actively preparing for exit" },
          { value: "not_planned", label: "No, not on the roadmap", description: "No plans for funding or exit" },
          { value: "other", label: "Other (please describe)", description: "Custom funding or exit situation" },
        ]}
        value={typeof fundingSelected === "string" ? fundingSelected : ""}
        onChange={(val) => onAnswer("funding_status", val)}
        variant="cards"
      />

      {/* Conditionally show "Other" field */}
      {typeof fundingSelected === "string" && fundingSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the other ways you are currently raising capital or preparing for an exit"
          placeholder="Describe any how you are preparing..."
          value={getStringAnswer(answers["funding_status_other"])}
          onChange={(val) => onAnswer("funding_status_other", val)}
          maxLength={100}
          rows={3}
        />
      )}

      {/* Question 18: Growth Pace */}
      <EnhancedMultipleChoiceQuestion
        question="What is your ideal pace of growth?"
        description="How fast do you want to grow?"
        options={[
          { value: "10_25", label: "10–25% YoY", description: "Steady, sustainable growth" },
          { value: "25_50", label: "25–50% YoY", description: "Aggressive but manageable" },
          { value: "50_100", label: "50–100% YoY", description: "High-velocity growth" },
          { value: "2x_3x", label: "2x–3x", description: "Doubling or tripling annually" },
          { value: "3x_plus", label: "3x+", description: "Hypergrowth mode" },
          { value: "unsure", label: "Unsure", description: "Not sure yet" },
        ]}
        value={getStringAnswer(answers["growth_pace"])}
        onChange={(val) => onAnswer("growth_pace", val)}
        variant="cards"
      />
    </div>
  );
}
