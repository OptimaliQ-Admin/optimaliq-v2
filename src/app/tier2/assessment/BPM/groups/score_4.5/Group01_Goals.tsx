"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";


export function isGroup01Complete(answers: Record<string, any>): boolean {
  const hasGrowthMetrics =
    Array.isArray(answers["growth_metrics"]) &&
    answers["growth_metrics"].length > 0;

  const hasGTMStrategy =
    typeof answers["gtm_strategy"] === "string" &&
    answers["gtm_strategy"].trim().length > 0;

  const hasFrictionPoints =
    Array.isArray(answers["friction_points"]) &&
    answers["friction_points"].length > 0;

  return hasGrowthMetrics && hasGTMStrategy && hasFrictionPoints;
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group01_Goals({ answers, onAnswer }: Props) {
  const growthSelected = answers["growth_metrics"] || [];
  const frictionSelected = answers["friction_points"] || [];

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: insight_to_strategy */}
      <MultipleChoiceQuestion
  question="How often do your processes generate insights that directly inform strategic decisions (e.g. investments, org design, tooling)?"
  options={[
    { value: "Rarely", label: "Rarely" },
    { value: "Sometimes", label: "Sometimes" },
    { value: "Frequently", label: "Frequently" },
    { value: "Always", label: "Always — insights are tightly linked to strategy" },
  ]}
  value={answers["insight_to_strategy"] || ""}
  onChange={(val) => onAnswer("insight_to_strategy", val)}
/>




     {/* Question 2: predictive_analytics */}
<MultipleChoiceQuestion
  question="Do you use forecasting, predictive analytics, or AI to anticipate process bottlenecks or demand shifts?"
  options={[
    { value: "Not at all", label: "Not at all" },
    { value: "Occasionally", label: "Occasionally, in some areas" },
    { value: "Frequently", label: "Frequently, with good accuracy" },
    { value: "Yes", label: "Yes — it’s a core capability" },
  ]}
  value={answers["predictive_analytics"] || ""}
  onChange={(val) => onAnswer("predictive_analytics", val)}
/>


      {/* Question 3: governance_model */}
      <MultiSelectQuestion
  question="Which of the following are embedded into your process governance model?"
  options={[
    { value: "Performance metrics", label: "Performance metrics" },
    { value: "Risk & compliance checks", label: "Risk & compliance checks" },
    { value: "SLA tracking", label: "SLA tracking" },
    { value: "Change management workflows", label: "Change management workflows" },
    { value: "Executive sponsorship", label: "Executive sponsorship" },
  ]}
  selected={governance_model}
        onChange={(val) => onAnswer("governance_model", val)}
        maxSelect={5}
      />
    </div>
  );
}
