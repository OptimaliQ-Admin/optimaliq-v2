"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_adoption_score_1"] === "string" &&
    typeof answers["tech_scalability_score_1"] === "string" &&
    typeof answers["future_readiness_score_1"] === "string"
  );
}

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your current AI/ML adoption?"
        options={[
          { value: "none", label: "None — not using AI/ML technologies" },
          { value: "exploring", label: "Exploring — evaluating potential use cases" },
          { value: "implementing", label: "Implementing — piloting some solutions" },
          { value: "mature", label: "Mature — actively using AI/ML in operations" },
        ]}
        value={getStringAnswer(answers["ai_adoption_score_1"])}
        onChange={(val) => onAnswer("ai_adoption_score_1", val)}
      />

      <MultipleChoiceQuestion
        question="How scalable is your current technology infrastructure?"
        options={[
          { value: "not_scalable", label: "Not scalable — struggles with growth" },
          { value: "limited", label: "Limited — can handle some growth" },
          { value: "moderate", label: "Moderate — scales with some effort" },
          { value: "highly", label: "Highly scalable — built for growth" },
        ]}
        value={getStringAnswer(answers["tech_scalability_score_1"])}
        onChange={(val) => onAnswer("tech_scalability_score_1", val)}
      />

      <MultipleChoiceQuestion
        question="How prepared is your tech stack for future needs?"
        options={[
          { value: "not_prepared", label: "Not prepared — focused on current needs only" },
          { value: "somewhat", label: "Somewhat — basic future planning" },
          { value: "well", label: "Well prepared — regular future planning" },
          { value: "very", label: "Very prepared — actively investing in future tech" },
        ]}
        value={getStringAnswer(answers["future_readiness_score_1"])}
        onChange={(val) => onAnswer("future_readiness_score_1", val)}
      />
    </div>
  );
} 