"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_performance_metrics"] === "string" &&
    typeof answers["ai_training_governance"] === "string" &&
    typeof answers["ai_model_evolution"] === "string" &&
    typeof answers["ai_operational_resilience"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_performance_metrics */}
      <MultipleChoiceQuestion
        question="How do you track the performance of your AI initiatives?"
        options={[
          { value: "no_tracking", label: "We don’t track performance formally" },
          { value: "basic_tracking", label: "We track basic performance KPIs" },
          { value: "business_alignment", label: "Metrics are aligned with business goals" },
          { value: "dynamic_feedback_loops", label: "Performance is tracked in real-time with feedback loops" },
        ]}
        value={getStringAnswer(answers["ai_performance_metrics"])}
        onChange={(val) => onAnswer("ai_performance_metrics", val)}
      />

      {/* Question 5: ai_training_governance */}
      <MultipleChoiceQuestion
        question="How do you govern the training data used in AI models?"
        options={[
          { value: "unclear_sources", label: "We use what’s available — governance is unclear" },
          { value: "team_level_checks", label: "Teams do their own checks or validations" },
          { value: "standards_for_bias", label: "We enforce standards for data bias and quality" },
          { value: "centralized_curation", label: "We have centralized data curation and approval processes" },
        ]}
        value={getStringAnswer(answers["ai_training_governance"])}
        onChange={(val) => onAnswer("ai_training_governance", val)}
      />

      {/* Question 6: ai_model_evolution */}
      <MultipleChoiceQuestion
        question="How often do you review and update your AI models?"
        options={[
          { value: "rarely", label: "Rarely — only when issues arise" },
          { value: "scheduled", label: "On a scheduled basis (e.g., quarterly)" },
          { value: "performance_triggered", label: "Based on model performance metrics" },
          { value: "continuous_monitoring", label: "We use continuous monitoring and retraining" },
        ]}
        value={getStringAnswer(answers["ai_model_evolution"])}
        onChange={(val) => onAnswer("ai_model_evolution", val)}
      />

      {/* Question 7: ai_operational_resilience */}
      <MultipleChoiceQuestion
        question="How do you ensure resilience and fallback when AI fails or makes poor decisions?"
        options={[
          { value: "manual_override", label: "Human teams manually intervene if needed" },
          { value: "rules_engine_fallbacks", label: "We have rules engines or backup logic in place" },
          { value: "multi_model_design", label: "We use multi-model approaches or ensembles" },
          { value: "automated_failover", label: "We use automated failover and impact analysis systems" },
        ]}
        value={getStringAnswer(answers["ai_operational_resilience"])}
        onChange={(val) => onAnswer("ai_operational_resilience", val)}
      />
    </div>
  );
}
