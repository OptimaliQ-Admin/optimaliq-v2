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
    typeof answers["campaign_adaptability"] === "string" &&
    typeof answers["goal_alignment"] === "string" &&
    Array.isArray(answers["forward_capabilities"]) &&
    answers["forward_capabilities"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  const selectedCapabilities = answers["forward_capabilities"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 1: campaign_adaptability */}
      <MultipleChoiceQuestion
        question="To what extent do your marketing campaigns evolve based on data or external signals?"
        options={[
          { value: "static", label: "Rarely — campaigns are static" },
          { value: "occasional_adjustments", label: "Occasionally adjusted post-launch" },
          { value: "real_time_signals", label: "We use real-time signals to adapt creative" },
          { value: "continuously_optimized", label: "Continuously optimized using dynamic inputs" }
        ]}
        value={getStringAnswer(answers["campaign_adaptability"])}
        onChange={(val) => onAnswer("campaign_adaptability", val)}
      />

      {/* Question 2: goal_alignment */}
      <MultipleChoiceQuestion
        question="How are your marketing goals aligned with your company’s strategic objectives?"
        options={[
          { value: "not_aligned", label: "Not clearly aligned" },
          { value: "after_strategy", label: "They align after the strategy is finalized" },
          { value: "informed_by_strategy", label: "They’re informed by strategic direction" },
          { value: "co_created", label: "They’re co-created with leadership and revenue teams" }
        ]}
        value={getStringAnswer(answers["goal_alignment"])}
        onChange={(val) => onAnswer("goal_alignment", val)}
      />

      {/* Question 3: forward_capabilities */}
      <MultiSelectQuestion
        question="Which of these forward-looking capabilities are part of your marketing practice?"
        options={[
          { value: "predictive_analytics", label: "Predictive analytics" },
          { value: "real_time_personalization", label: "Real-time personalization" },
          { value: "triggered_lifecycle_journeys", label: "Triggered lifecycle journeys" },
          { value: "ai_testing_optimization", label: "AI for testing or optimization" },
          { value: "none", label: "None of these" }
        ]}
        selected={selectedCapabilities}
        onChange={(val) => onAnswer("forward_capabilities", val)}
        maxSelect={5}
      />
    </div>
  );
}
