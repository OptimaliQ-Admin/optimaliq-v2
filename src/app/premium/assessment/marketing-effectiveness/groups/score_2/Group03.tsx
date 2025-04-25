"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["confidence_in_marketing_roi"] === "string" &&
    answers["confidence_in_marketing_roi"].trim().length > 0 &&
    typeof answers["recent_experiment"] === "string" &&
    answers["recent_experiment"].trim().length > 0 &&
    typeof answers["marketing_impact_opportunity"] === "string" &&
    answers["marketing_impact_opportunity"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: confidence_in_marketing_roi */}
      <MultipleChoiceQuestion
        question="What’s your level of confidence in how marketing contributes to revenue or growth?"
        options={[
          { value: "Low — we’re not sure how it connects", label: "Low — we’re not sure how it connects" },
          { value: "Moderate — we see correlation, not causation", label: "Moderate — we see correlation, not causation" },
          { value: "Good — we track conversions and pipeline", label: "Good — we track conversions and pipeline" },
          { value: "High — we forecast and measure ROI confidently", label: "High — we forecast and measure ROI confidently" },
        ]}
        value={getStringAnswer(answers["confidence_in_marketing_roi"])}
        onChange={(val) => onAnswer("confidence_in_marketing_roi", val)}
      />

      {/* Question 9: recent_experiment */}
      <TextAreaQuestion
        question="What’s one marketing experiment or test you’ve tried in the past 6 months?"
        placeholder="E.g., new email format, A/B test, landing page, ad channel"
        value={getStringAnswer(answers["recent_experiment"])}
        onChange={(val) => onAnswer("recent_experiment", val)}
        maxLength={300}
      />

      {/* Question 10: marketing_impact_opportunity */}
      <TextAreaQuestion
        question="What part of your marketing do you think has the most untapped potential right now?"
        placeholder="E.g., nurturing, conversion, messaging, new audiences"
        value={getStringAnswer(answers["marketing_impact_opportunity"])}
        onChange={(val) => onAnswer("marketing_impact_opportunity", val)}
        maxLength={300}
      />
    </div>
  );
}
