"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";


export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["insight_to_strategy"] === "string" &&
    answers["insight_to_strategy"].trim().length > 0 &&

    typeof answers["predictive_analytics"] === "string" &&
    answers["predictive_analytics"].trim().length > 0 &&

    Array.isArray(answers["governance_model"]) &&
    answers["governance_model"].length > 0
  );
}




type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  const governance_model = answers["governance_model"] || [];


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
  value={getStringAnswer(answers["insight_to_strategy"])}
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
  value={getStringAnswer(answers["predictive_analytics"])}
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
  selected={Array.isArray(getArrayAnswer(governance_model)) ? getArrayAnswer(governance_model) : []}
        onChange={(val) => onAnswer("governance_model", val)}
        maxSelect={5}
      />
    </div>
  );
}
