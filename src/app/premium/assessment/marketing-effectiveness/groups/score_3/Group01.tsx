"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["attribution_tracking"] === "string" &&
    typeof answers["audience_segmentation"] === "string" &&
    typeof answers["message_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: attribution_tracking */}
      <MultipleChoiceQuestion
        question="How do you evaluate which campaigns or channels are driving results?"
        options={[
          { value: "single_touch", label: "We track single-touch attribution" },
          { value: "multi_touch", label: "We use basic multi-touch attribution" },
          { value: "automated_model", label: "We use an automated attribution model" },
          { value: "holistic", label: "We look at contribution holistically (influenced revenue, lift, etc.)" },
        ]}
        value={getStringAnswer(answers["attribution_tracking"])}
        onChange={(val) => onAnswer("attribution_tracking", val)}
      />

      {/* Question 2: audience_segmentation */}
      <MultipleChoiceQuestion
        question="Which best describes your current audience segmentation?"
        options={[
          { value: "geography_or_lists", label: "We segment by geography or lists" },
          { value: "behavior_or_lifecycle", label: "We segment by behavior or lifecycle stage" },
          { value: "deep_segmenting", label: "We use persona-based or multi-dimensional segmentation" },
          { value: "advanced_models", label: "We use lookalikes, predictive models, or AI segmentation" },
        ]}
        value={getStringAnswer(answers["audience_segmentation"])}
        onChange={(val) => onAnswer("audience_segmentation", val)}
      />

      {/* Question 3: message_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your marketing messages to each stage of the funnel?"
        options={[
          { value: "same_across_all", label: "It’s the same across all stages" },
          { value: "some_variation", label: "Light variation by stage" },
          { value: "intent_messaging", label: "Tailored messages by intent or segment" },
          { value: "personalized_by_stage", label: "Personalized messages by both stage and persona" },
        ]}
        value={getStringAnswer(answers["message_alignment"])}
        onChange={(val) => onAnswer("message_alignment", val)}
      />
    </div>
  );
}
