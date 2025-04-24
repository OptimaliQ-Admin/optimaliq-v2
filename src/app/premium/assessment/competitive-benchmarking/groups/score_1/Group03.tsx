"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["pricing_positioning"] === "string" &&
    typeof answers["industry_benchmarking"] === "string" &&
    typeof answers["competitive_blindspots"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: pricing_positioning */}
      <MultipleChoiceQuestion
        question="How does your pricing compare to competitors?"
        options={[
          { value: "no_strategy", label: "We don’t really have a pricing strategy" },
          { value: "lower_pricing", label: "We aim to be cheaper" },
          { value: "middle_of_pack", label: "We’re somewhere in the middle" },
          { value: "premium", label: "We price based on value or premium positioning" },
        ]}
        value={getStringAnswer(answers["pricing_positioning"])}
        onChange={(val) => onAnswer("pricing_positioning", val)}
      />

      {/* Question 9: industry_benchmarking */}
      <MultipleChoiceQuestion
        question="How often do you benchmark your business against competitors or peers?"
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely — only when we hear something interesting" },
          { value: "sometimes", label: "Sometimes — through informal comparisons" },
          { value: "regularly", label: "Regularly — we use benchmarks in our strategy" },
        ]}
        value={getStringAnswer(answers["industry_benchmarking"])}
        onChange={(val) => onAnswer("industry_benchmarking", val)}
      />

      {/* Question 10: competitive_blindspots */}
      <MultipleChoiceQuestion
        question="Where do you feel you have the biggest blind spots competitively?"
        options={[
          { value: "product_features", label: "Product features or capabilities" },
          { value: "positioning", label: "How we’re positioned vs. others" },
          { value: "customer_perception", label: "How customers compare us" },
          { value: "none", label: "We don’t think we have any major blind spots" },
        ]}
        value={getStringAnswer(answers["competitive_blindspots"])}
        onChange={(val) => onAnswer("competitive_blindspots", val)}
      />
    </div>
  );
}
