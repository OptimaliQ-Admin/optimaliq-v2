"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitor_selection"] === "string" &&
    Array.isArray(answers["benchmark_metrics"]) &&
    typeof answers["data_collection_method"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: competitor_selection */}
      <MultipleChoiceQuestion
        question="How do you identify which competitors to benchmark against?"
        options={[
          { value: "dont_benchmark", label: "We don’t benchmark competitors" },
          { value: "occasional_comparisons", label: "We occasionally compare ourselves to a few peers" },
          { value: "specific_criteria", label: "We use specific criteria like market share, product overlap" },
          { value: "strategic_focus", label: "We choose competitors based on strategic focus or opportunity" },
        ]}
        value={getStringAnswer(answers["competitor_selection"])}
        onChange={(val) => onAnswer("competitor_selection", val)}
      />

      {/* Question 2: benchmark_metrics */}
      <MultiSelectQuestion
        question="What metrics do you typically use to compare against competitors?"
        options={[
          { value: "revenue_growth", label: "Revenue or growth rate" },
          { value: "pricing_packaging", label: "Pricing or packaging" },
          { value: "features_services", label: "Features or service levels" },
          { value: "brand_presence", label: "Brand awareness or market presence" },
          { value: "employee_insights", label: "Employee reviews or team size" },
        ]}
        selected={Array.isArray(getArrayAnswer(answers["benchmark_metrics"] || [])) ? getArrayAnswer(answers["benchmark_metrics"] || []) : []}
        onChange={(val) => onAnswer("benchmark_metrics", val)}
        maxSelect={5}
      />

      {/* Question 3: data_collection_method */}
      <MultipleChoiceQuestion
        question="How do you collect data about competitors today?"
        options={[
          { value: "no_data_collection", label: "We don’t collect competitive data" },
          { value: "review_websites", label: "We review websites or public content" },
          { value: "internal_notes", label: "We gather intel from sales/marketing conversations" },
          { value: "formal_process", label: "We use a formal process or tool for tracking competitors" },
        ]}
        value={getStringAnswer(answers["data_collection_method"])}
        onChange={(val) => onAnswer("data_collection_method", val)}
      />
    </div>
  );
}
