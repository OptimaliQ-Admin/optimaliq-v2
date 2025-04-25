"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["marketing_roi"] === "string" &&
    typeof answers["campaign_testing"] === "string" &&
    Array.isArray(answers["performance_metrics"]) &&
    answers["performance_metrics"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  const metrics = answers["performance_metrics"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: marketing_roi */}
      <MultipleChoiceQuestion
        question="How do you assess the ROI of your marketing efforts?"
        options={[
          { value: "We don’t calculate ROI", label: "We don’t calculate ROI" },
          { value: "We look at cost vs leads or sales", label: "We look at cost vs leads or sales" },
          { value: "We use UTM tracking and attribution", label: "We use UTM tracking and attribution" },
          { value: "We have defined ROI targets and dashboards", label: "We have defined ROI targets and dashboards" },
        ]}
        value={getStringAnswer(answers["marketing_roi"])}
        onChange={(val) => onAnswer("marketing_roi", val)}
      />

      {/* Question 2: campaign_testing */}
      <MultipleChoiceQuestion
        question="How often do you test and optimize your campaigns?"
        options={[
          { value: "Rarely — we launch and hope", label: "Rarely — we launch and hope" },
          { value: "Occasionally — A/B testing headlines or subject lines", label: "Occasionally — A/B testing headlines or subject lines" },
          { value: "Frequently — we review and iterate weekly", label: "Frequently — we review and iterate weekly" },
          { value: "Continuously — using AI, scripts, or live testing", label: "Continuously — using AI, scripts, or live testing" },
        ]}
        value={getStringAnswer(answers["campaign_testing"])}
        onChange={(val) => onAnswer("campaign_testing", val)}
      />

      {/* Question 3: performance_metrics */}
      <MultiSelectQuestion
        question="Which of the following performance metrics do you track?"
        options={[
          { value: "Open/click rates", label: "Open/click rates" },
          { value: "Conversion rates", label: "Conversion rates" },
          { value: "Cost per lead or acquisition", label: "Cost per lead or acquisition" },
          { value: "Revenue attribution", label: "Revenue attribution" },
          { value: "Customer lifetime value (LTV)", label: "Customer lifetime value (LTV)" },
        ]}
        selected={Array.isArray(getArrayAnswer(metrics)) ? getArrayAnswer(metrics) : []}
        onChange={(val) => onAnswer("performance_metrics", val)}
        maxSelect={5}
      />
    </div>
  );
}
