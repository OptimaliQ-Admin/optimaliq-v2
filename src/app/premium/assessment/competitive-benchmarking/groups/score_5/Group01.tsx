"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmarking_strategy_integration"] === "string" &&
    typeof answers["benchmarking_scope"] === "string" &&
    typeof answers["market_share_accuracy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: benchmarking_strategy_integration */}
      <MultipleChoiceQuestion
        question="How embedded is competitive benchmarking in your broader business strategy?"
        options={[
          { value: "not_linked", label: "It’s not really linked to strategy" },
          { value: "referenced", label: "It’s referenced occasionally by teams" },
          { value: "informs_choices", label: "It informs key choices and priorities" },
          { value: "core_input", label: "It’s a core input to planning and forecasting" },
        ]}
        value={getStringAnswer(answers["benchmarking_strategy_integration"])}
        onChange={(val) => onAnswer("benchmarking_strategy_integration", val)}
      />

      {/* Question 2: benchmarking_scope */}
      <MultipleChoiceQuestion
        question="What types of benchmarking are part of your current process?"
        options={[
          { value: "none", label: "None — we only look at internal metrics" },
          { value: "industry_only", label: "Only basic industry or category data" },
          { value: "mix_methods", label: "We mix public data, research, and performance" },
          { value: "full_scope", label: "We include customer, product, pricing, and brand-level insights" },
        ]}
        value={getStringAnswer(answers["benchmarking_scope"])}
        onChange={(val) => onAnswer("benchmarking_scope", val)}
      />

      {/* Question 3: market_share_accuracy */}
      <MultipleChoiceQuestion
        question="How confident are you in your understanding of your market share?"
        options={[
          { value: "no_clue", label: "We honestly don’t know" },
          { value: "rough_estimate", label: "We have a rough estimate" },
          { value: "pretty_confident", label: "We’re pretty confident in the number" },
          { value: "data_backed", label: "We use external benchmarks and track it quarterly" },
        ]}
        value={getStringAnswer(answers["market_share_accuracy"])}
        onChange={(val) => onAnswer("market_share_accuracy", val)}
      />
    </div>
  );
}
