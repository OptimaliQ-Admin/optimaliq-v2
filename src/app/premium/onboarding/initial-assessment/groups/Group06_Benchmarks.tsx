//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group06_Benchmarks.tsx
"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


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
    <div className="space-y-10">
      {/* Question 16: Insights & Benchmarks */}
      <MultiSelectQuestion
        question="What type of insights or benchmarks would be most valuable to you right now?"
        description="Select all that apply"
        options={[
          { value: "competitor_comparison", label: "Competitor comparison" },
          { value: "revenue_growth", label: "Revenue growth levers" },
          { value: "retention", label: "Retention improvements" },
          { value: "efficiency", label: "Operational efficiency plays" },
          { value: "industry_best_practices", label: "Industry best practices" },
          { value: "automation", label: "Process automation opportunities" },
          { value: "tech_stack", label: "Tech stack recommendations" },
          { value: "funnel_analysis", label: "Marketing & sales funnel analysis" },
          { value: "other", label: "Other (please describe)" },
        ]}
        selected={benchmarkSelected}
        onChange={(val) => onAnswer("benchmark_preferences", val)}
        maxSelect={6}
      />

      {/* Conditionally show "Other" field */}
      {benchmarkSelected.includes("other") && (
        <TextAreaQuestion
          question="Please describe the other insights or benchmarks"
          placeholder="Describe any additional insights or benchmarks..."
          value={getStringAnswer(answers["benchmark_preferences_other"])}
          onChange={(val) => onAnswer("benchmark_preferences_other", val)}
          maxLength={50}
        />
      )}

      {/* Question 17: Capital/Funding Status */}
      <MultipleChoiceQuestion
        question="Are you currently raising capital or preparing for an exit?"
        options={[
          { value: "raising_now", label: "Yes, actively raising" },
          { value: "early_planning", label: "In early planning stages" },
          { value: "preparing_exit", label: "Preparing for acquisition or sale" },
          { value: "not_planned", label: "No, not on the roadmap" },
          { value: "other", label: "Other (please describe)" },
        ]}
        value={fundingSelected}
        onChange={(val) => onAnswer("funding_status", val)}
      />

      {/* Conditionally show "Other" field */}
      {fundingSelected.includes("other") && (
        <TextAreaQuestion
          question="Please describe the other ways you are currently raising capital or preparing for an exit"
          placeholder="Describe any how you are preparing..."
          value={getStringAnswer(answers["funding_status_other"])}
          onChange={(val) => onAnswer("funding_status_other", val)}
          maxLength={50}
        />
      )}

      {/* Question 18: Growth Pace */}
      <MultipleChoiceQuestion
        question="What is your ideal pace of growth?"
        options={[
          { value: "10_25", label: "10–25% YoY" },
          { value: "25_50", label: "25–50% YoY" },
          { value: "50_100", label: "50–100% YoY" },
          { value: "2x_3x", label: "2x–3x" },
          { value: "3x_plus", label: "3x+" },
          { value: "unsure", label: "Unsure" },
        ]}
        value={getStringAnswer(answers["growth_pace"])}
        onChange={(val) => onAnswer("growth_pace", val)}
      />
    </div>
  );
}
