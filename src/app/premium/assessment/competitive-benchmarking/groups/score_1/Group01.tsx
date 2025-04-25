"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["industry_comparison"] === "string" &&
    typeof answers["performance_visibility"] === "string" &&
    typeof answers["benchmark_tracking"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: industry_comparison */}
      <MultipleChoiceQuestion
        question="How confident are you in how your company compares to others in your industry?"
        options={[
          { value: "no_idea", label: "We have no idea how we compare" },
          { value: "gut_feeling", label: "We rely on gut feeling or hearsay" },
          { value: "some_benchmarking", label: "We have some benchmarks or anecdotal comparisons" },
          { value: "data_driven", label: "We use data or reports to compare ourselves" },
        ]}
        value={getStringAnswer(answers["industry_comparison"])}
        onChange={(val) => onAnswer("industry_comparison", val)}
      />

      {/* Question 2: performance_visibility */}
      <MultipleChoiceQuestion
        question="How well do you understand your current performance across key business areas?"
        options={[
          { value: "very_little", label: "Very little — we operate reactively" },
          { value: "basic_ideas", label: "We have basic ideas but nothing formal" },
          { value: "some_data", label: "We track some data consistently" },
          { value: "strong_visibility", label: "We have strong visibility into core KPIs" },
        ]}
        value={getStringAnswer(answers["performance_visibility"])}
        onChange={(val) => onAnswer("performance_visibility", val)}
      />

      {/* Question 3: benchmark_tracking */}
      <MultipleChoiceQuestion
        question="Do you track any external or competitive benchmarks?"
        options={[
          { value: "none", label: "No, we don’t use benchmarks" },
          { value: "ad_hoc", label: "Occasionally, and only when we come across data" },
          { value: "internal_reviews", label: "Yes, as part of internal reviews or planning" },
          { value: "ongoing_benchmarking", label: "Yes, ongoing benchmarking is part of our process" },
        ]}
        value={getStringAnswer(answers["benchmark_tracking"])}
        onChange={(val) => onAnswer("benchmark_tracking", val)}
      />
    </div>
  );
}
