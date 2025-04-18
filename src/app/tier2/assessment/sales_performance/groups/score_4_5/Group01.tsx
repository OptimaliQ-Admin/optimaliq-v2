"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["sales_capacity_monitoring"] === "string" &&
    answers["sales_capacity_monitoring"].trim().length > 0 &&
    Array.isArray(answers["advanced_insights_used"]) &&
    answers["advanced_insights_used"].length > 0 &&
    typeof answers["methodology_testing"] === "string" &&
    answers["methodology_testing"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  const selectedInsights = answers["advanced_insights_used"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: sales_capacity_monitoring */}
      <MultipleChoiceQuestion
        question="How do you proactively monitor sales capacity across segments?"
        options={[
          { value: "no_monitoring", label: "We don’t monitor it actively" },
          { value: "manager_level", label: "Manager-level tracking only" },
          { value: "capacity_modeling", label: "We use capacity modeling by team/segment" },
          { value: "integrated_dashboard", label: "Live dashboards with forecast + productivity" },
        ]}
        value={answers["sales_capacity_monitoring"] || ""}
        onChange={(val) => onAnswer("sales_capacity_monitoring", val)}
      />

      {/* Question 2: advanced_insights_used */}
      <MultiSelectQuestion
        question="Which of the following advanced sales insights are used in your business?"
        options={[
          { value: "pipeline_velocity", label: "Pipeline velocity by segment" },
          { value: "deal_slippage", label: "Deal slippage tracking" },
          { value: "rep_engagement", label: "Rep engagement heatmaps" },
          { value: "ai_scoring", label: "AI-powered win likelihood or scoring" },
        ]}
        selected={selectedInsights}
        onChange={(val) => onAnswer("advanced_insights_used", val)}
        maxSelect={4}
      />

      {/* Question 3: methodology_testing */}
      <MultipleChoiceQuestion
        question="How do you test and evolve your sales methodology or approach?"
        options={[
          { value: "no_evolution", label: "We don’t evolve it much" },
          { value: "test_and_adopt", label: "We test ideas occasionally" },
          { value: "rep_feedback_loop", label: "We evolve based on rep + manager feedback" },
          { value: "experiment_and_validate", label: "We run A/B tests and validate changes" },
        ]}
        value={answers["methodology_testing"] || ""}
        onChange={(val) => onAnswer("methodology_testing", val)}
      />
    </div>
  );
}
