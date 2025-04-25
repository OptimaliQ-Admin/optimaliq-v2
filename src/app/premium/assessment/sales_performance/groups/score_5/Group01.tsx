"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_136dcf"] === "string" &&
    Array.isArray(answers["which_68025d"]) &&
    answers["which_68025d"].length > 0 &&
    typeof answers["how_e9af60"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  const selected = answers["which_68025d"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_136dcf */}
      <MultipleChoiceQuestion
        question="How does your sales org contribute to shaping company strategy and innovation?"
        options={[
          { value: "not_involved", label: "Sales delivers results, but isn’t involved in strategy" },
          { value: "market_insights", label: "Sales provides occasional market insights" },
          { value: "gtm_collaboration", label: "Sales participates in GTM or product strategy" },
          { value: "co_owns_innovation", label: "Sales co-owns innovation planning based on buyer intelligence" },
        ]}
        value={getStringAnswer(answers["how_136dcf"])}
        onChange={(val) => onAnswer("how_136dcf", val)}
      />

      {/* Question 2: which_68025d */}
      <MultiSelectQuestion
        question="Which of the following future-focused capabilities are active in your sales operations?"
        options={[
          { value: "ai_forecasting", label: "AI-enhanced forecasting" },
          { value: "buyer_intent", label: "Buyer intent and account intelligence" },
          { value: "real_time_coaching", label: "Real-time coaching and deal insights" },
          { value: "adaptive_territory", label: "Adaptive territory planning" },
          { value: "predictive_modeling", label: "Predictive revenue modeling" },
        ]}
        selected={Array.isArray(getArrayAnswer(selected)) ? getArrayAnswer(selected) : []}
        onChange={(val) => onAnswer("which_68025d", val)}
        maxSelect={5}
      />

      {/* Question 3: how_e9af60 */}
      <MultipleChoiceQuestion
        question="How do you ensure your sales culture supports learning, experimentation, and continuous improvement?"
        options={[
          { value: "performance_only", label: "We focus mostly on performance outcomes" },
          { value: "informal_learning", label: "Learning happens informally" },
          { value: "growth_supported", label: "We support growth through feedback and enablement" },
          { value: "learning_norm", label: "Learning is a cultural norm tied to performance and growth metrics" },
        ]}
        value={getStringAnswer(answers["how_e9af60"])}
        onChange={(val) => onAnswer("how_e9af60", val)}
      />
    </div>
  );
}
