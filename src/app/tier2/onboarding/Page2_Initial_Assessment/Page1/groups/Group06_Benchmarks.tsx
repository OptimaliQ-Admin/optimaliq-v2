"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";


export function isGroup06Complete(answers: Record<string, any>): boolean {
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
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group06_Benchmarks({ answers, onAnswer }: Props) {
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
        selected={answers["benchmark_preferences"] || []}
        onChange={(val) => onAnswer("benchmark_preferences", val)}
        maxSelect={6}
      />

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
        value={answers["funding_status"] || ""}
        onChange={(val) => onAnswer("funding_status", val)}
      />

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
        value={answers["growth_pace"] || ""}
        onChange={(val) => onAnswer("growth_pace", val)}
      />
    </div>
  );
}
