"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["marketing_success_metrics"] === "string" &&
    typeof answers["customer_journey_definition"] === "string" &&
    typeof answers["audience_segmentation_frequency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: marketing_success_metrics */}
      <MultipleChoiceQuestion
        question="How do you measure the success of your marketing campaigns?"
        options={[
          { value: "Based on gut feel or team input", label: "Based on gut feel or team input" },
          { value: "We track open or click rates", label: "We track open or click rates" },
          { value: "We look at conversions or leads", label: "We look at conversions or leads" },
          { value: "We measure ROI and pipeline contribution", label: "We measure ROI and pipeline contribution" },
        ]}
        value={answers["marketing_success_metrics"] || ""}
        onChange={(val) => onAnswer("marketing_success_metrics", val)}
      />

      {/* Question 2: customer_journey_definition */}
      <MultipleChoiceQuestion
        question="Do you have a defined customer journey or funnel?"
        options={[
          { value: "No — we operate campaign by campaign", label: "No — we operate campaign by campaign" },
          { value: "Rough stages only", label: "We have rough stages only" },
          { value: "Funnel by channel or team", label: "We have a funnel by channel or team" },
          { value: "Documented funnel with clear conversion goals", label: "Documented funnel with clear conversion goals" },
        ]}
        value={answers["customer_journey_definition"] || ""}
        onChange={(val) => onAnswer("customer_journey_definition", val)}
      />

      {/* Question 3: audience_segmentation_frequency */}
      <MultipleChoiceQuestion
        question="How often do you segment your audience for campaigns?"
        options={[
          { value: "We don’t segment", label: "We don’t segment" },
          { value: "Occasionally by list or geography", label: "Occasionally by list or geography" },
          { value: "We segment by behavior or engagement", label: "We segment by behavior or engagement" },
          { value: "Always — every campaign has targeting logic", label: "Always — every campaign has targeting logic" },
        ]}
        value={answers["audience_segmentation_frequency"] || ""}
        onChange={(val) => onAnswer("audience_segmentation_frequency", val)}
      />
    </div>
  );
}
