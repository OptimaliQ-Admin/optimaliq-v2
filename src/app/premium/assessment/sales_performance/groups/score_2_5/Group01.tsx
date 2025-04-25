"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_61a52a"] === "string" &&
    typeof answers["how_9e698a"] === "string" &&
    typeof answers["how_e2391b"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_61a52a */}
      <MultipleChoiceQuestion
        question="How are you currently forecasting revenue from your sales pipeline?"
        options={[
          { value: "gut", label: "Based on deal count or gut feel" },
          { value: "weighted", label: "Weighted by stage or rep confidence" },
          { value: "historical_avg", label: "Based on past performance averages" },
          { value: "modeled", label: "Modeled through CRM tools or formulas" },
        ]}
        value={getStringAnswer(answers["how_61a52a"])}
        onChange={(val) => onAnswer("how_61a52a", val)}
      />

      {/* Question 2: how_9e698a */}
      <MultipleChoiceQuestion
        question="How do you ensure follow-ups and next steps are happening consistently across deals?"
        options={[
          { value: "no_system", label: "We don’t have a system" },
          { value: "rep_responsible", label: "Reps are responsible for follow-ups" },
          { value: "crm_tasks", label: "Tasks/reminders are assigned in the CRM" },
          { value: "workflows", label: "We have workflows or sequences to enforce follow-ups" },
        ]}
        value={getStringAnswer(answers["how_9e698a"])}
        onChange={(val) => onAnswer("how_9e698a", val)}
      />

      {/* Question 3: how_e2391b */}
      <MultipleChoiceQuestion
        question="How well does your team manage objections or stalls during the sales cycle?"
        options={[
          { value: "not_well", label: "We don’t handle them well" },
          { value: "reactive", label: "We address them as they arise" },
          { value: "training", label: "We use objection-handling training or scripts" },
          { value: "proactive", label: "We anticipate objections and proactively address them" },
        ]}
        value={getStringAnswer(answers["how_e2391b"])}
        onChange={(val) => onAnswer("how_e2391b", val)}
      />
    </div>
  );
}
