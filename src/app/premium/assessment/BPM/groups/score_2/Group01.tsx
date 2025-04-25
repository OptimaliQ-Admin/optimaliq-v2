"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; 
import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";


export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["consistency"]) &&
    answers["consistency"].length > 0 &&

    typeof answers["review_frequency"] === "string" &&
    answers["review_frequency"].trim().length > 0 &&

    typeof answers["ownership"] === "string" &&
    answers["ownership"].trim().length > 0
  );
}




type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  const consistency = answers["consistency"] || [];


  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: consistency */}
      <MultiSelectQuestion
  question="Which of your processes are followed consistently across all team members?"
  options={[
    { value: "revenue", label: "Sales or lead management" },
    { value: "profit_margin", label: "Customer onboarding" },
    { value: "customer_ltv", label: "Fulfillment or delivery" },
    { value: "customer_acquisition_cost", label: "Customer support" },
    { value: "churn_rate", label: "None — it still depends on who’s doing the work" },
  ]}
  selected={Array.isArray(getArrayAnswer(consistency)) ? getArrayAnswer(consistency) : []}
        onChange={(val) => onAnswer("consistency", val)}
        maxSelect={5}
      />




     {/* Question 2: review_frequency */}
<MultipleChoiceQuestion
  question="How often do you review or update your existing processes?"
  options={[
    { value: "Never", label: "Never — they’re mostly static" },
    { value: "Occasionally", label: "Occasionally, when problems arise" },
    { value: "Annually", label: "Annually or as part of planning cycles" },
    { value: "Quarterly", label: "Quarterly or more frequently" },
  ]}
  value={getStringAnswer(answers["review_frequency"])}
  onChange={(val) => onAnswer("review_frequency", val)}
/>


      {/* Question 3: ownership */}
      <MultipleChoiceQuestion
  question="Who is responsible for maintaining and improving key workflows in your business?"
  options={[
    { value: "No one", label: "No one — it’s not assigned" },
    { value: "person doing the work", label: "Usually the person doing the work" },
    { value: "team lead or department manager", label: "A team lead or department manager" },
    { value: "dedicated operations/process owner", label: "A dedicated operations/process owner" },
  ]}
  value={getStringAnswer(answers["ownership"])}
  onChange={(val) => onAnswer("ownership", val)}
/>
    </div>
  );
}
