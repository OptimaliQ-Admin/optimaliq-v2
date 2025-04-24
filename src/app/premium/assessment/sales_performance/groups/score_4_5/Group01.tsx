"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_18515e"] === "string" &&
    Array.isArray(answers["which_117dee"]) &&
    answers["which_117dee"].length > 0 &&
    typeof answers["how_70b7b8"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  const selectedInsights = answers["which_117dee"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_18515e */}
      <MultipleChoiceQuestion
        question="How do you proactively monitor sales capacity to prevent burnout or bottlenecks?"
        options={[
          { value: "not_monitored", label: "We don’t monitor it actively" },
          { value: "manager_checkins", label: "Managers check in during 1:1s" },
          { value: "quarterly_reviews", label: "We run quarterly reviews" },
          { value: "monthly_models", label: "Capacity models are updated monthly and tied to forecasting" },
        ]}
        value={getStringAnswer(answers["how_18515e"])}
        onChange={(val) => onAnswer("how_18515e", val)}
      />

      {/* Question 2: which_117dee */}
      <MultiSelectQuestion
        question="Which of the following advanced sales insights are part of your process today?"
        options={[
          { value: "pipeline_velocity", label: "Pipeline velocity by segment" },
          { value: "deal_slippage", label: "Deal slippage tracking" },
          { value: "predictive_close", label: "Predictive close probability" },
          { value: "revenue_per_activity", label: "Revenue per activity model" },
          { value: "cycle_benchmarking", label: "Sales cycle benchmarking by persona or vertical" },
        ]}
        selected={selectedInsights}
        onChange={(val) => onAnswer("which_117dee", val)}
        maxSelect={5}
      />

      {/* Question 3: how_70b7b8 */}
      <MultipleChoiceQuestion
        question="How do you test and evolve your sales methodology across markets or products?"
        options={[
          { value: "no_evolution", label: "We don’t evolve it much" },
          { value: "occasional_testing", label: "We test ideas occasionally" },
          { value: "pilot_segments", label: "We pilot changes in segments or teams" },
          { value: "strategic_experimentation", label: "We run strategic experimentation and track impact" },
        ]}
        value={getStringAnswer(answers["how_70b7b8"])}
        onChange={(val) => onAnswer("how_70b7b8", val)}
      />
    </div>
  );
}
