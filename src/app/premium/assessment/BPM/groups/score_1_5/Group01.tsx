import { getStringAnswer } from "@/lib/types/AssessmentAnswers";
"use client";

import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "src/components/questions/MultiSelectQuestion";


export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["coverage"]) &&
    answers["coverage"].length > 0 &&

    typeof answers["documentation_storage"] === "string" &&
    answers["documentation_storage"].trim().length > 0 &&

    typeof answers["error_response"] === "string" &&
    answers["error_response"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  const coverage = answers["coverage"] || [];

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
  value={getStringAnswer(answers["documentation_storage"])}
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
  value={getStringAnswer(answers["error_response"])}
  onChange={(val) => onAnswer("error_response", val)}
/>

    </div>
  );
}
