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

      {/* Question 1: coverage */}
      <MultiSelectQuestion
  question="Which parts of your business currently follow a repeatable process (even if it's not documented)?"
  options={[
    { value: "Customer_onboarding", label: "Customer onboarding" },
    { value: "Order_fulfillment", label: "Order fulfillment" },
    { value: "Customer_support", label: "Customer support" },
    { value: "Invoicing_or_billing", label: "Invoicing or billing" },
    { value: "Marketing_campaigns", label: "Marketing campaigns" },
    { value: "None", label: "None of the above" },
  ]}
  selected={coverage}
        onChange={(val) => onAnswer("coverage", val)}
        maxSelect={5}
      />




     {/* Question 2: documentation_storage */}
<MultipleChoiceQuestion
  question=" Do you have a central location where important process steps or templates are stored? "
  options={[
    { value: "No_central_location", label: "No central location" },
    { value: "email_or_chat", label: "We store things in email or chat" },
    { value: "shared folders", label: "We use shared folders or Google Docs" },
    { value: "playbook system", label: "Yes, we use a wiki or playbook system" },
  ]}
  value={answers["documentation_storage"] || ""}
  onChange={(val) => onAnswer("documentation_storage", val)}
/>


      {/* Question 3: error_response */}
      <MultipleChoiceQuestion
  question=" When someone makes a mistake or misses a step, what typically happens next? "
  options={[
    { value: "fix it and move on", label: "We fix it and move on" },
    { value: "discuss it in the moment", label: "We discuss it in the moment" },
    { value: " try to understand why it happened", label: "We try to understand why it happened" },
    { value: "update the process to prevent it", label: "We update the process to prevent it" },
  ]}
  value={answers["error_response"] || ""}
  onChange={(val) => onAnswer("error_response", val)}
/>

    </div>
  );
}
