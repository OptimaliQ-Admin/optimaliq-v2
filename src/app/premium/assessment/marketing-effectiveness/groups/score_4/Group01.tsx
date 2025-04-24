"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["marketing_strategy_alignment"] === "string" &&
    typeof answers["marketing_evolution"] === "string" &&
    Array.isArray(answers["marketing_analytics"]) &&
    answers["marketing_analytics"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  const selectedAnalytics = answers["marketing_analytics"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 1: marketing_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How does marketing performance influence strategic decisions?"
        options={[
          { value: "doesnt_influence", label: "It doesn’t" },
          { value: "reviewed_occasionally", label: "It’s reviewed occasionally by leadership" },
          { value: "quarterly_review", label: "It’s part of quarterly or planning cycles" },
          { value: "real_time_feedback", label: "It drives real-time adjustments to priorities" }
        ]}
        value={getStringAnswer(answers["marketing_strategy_alignment"])}
        onChange={(val) => onAnswer("marketing_strategy_alignment", val)}
      />

      {/* Question 2: marketing_evolution */}
      <MultipleChoiceQuestion
        question="How do you continuously evolve your marketing strategy?"
        options={[
          { value: "when_things_fail", label: "When things stop working" },
          { value: "based_on_data", label: "Based on campaign data and trends" },
          { value: "proactive_testing", label: "Proactive — based on customer feedback and insights" },
          { value: "dedicated_innovation", label: "We have a dedicated innovation/research process" }
        ]}
        value={getStringAnswer(answers["marketing_evolution"])}
        onChange={(val) => onAnswer("marketing_evolution", val)}
      />

      {/* Question 3: marketing_analytics */}
      <MultiSelectQuestion
        question="Which of the following are built into your marketing analytics today?"
        options={[
          { value: "forecast_models", label: "Forecast models" },
          { value: "revenue_influence_mapping", label: "Revenue influence mapping" },
          { value: "customer_lifetime_value", label: "Customer lifetime value" },
          { value: "cross_channel_attribution", label: "Cross-channel attribution" },
          { value: "none", label: "None of these" }
        ]}
        selected={selectedAnalytics}
        onChange={(val) => onAnswer("marketing_analytics", val)}
        maxSelect={5}
      />
    </div>
  );
}
