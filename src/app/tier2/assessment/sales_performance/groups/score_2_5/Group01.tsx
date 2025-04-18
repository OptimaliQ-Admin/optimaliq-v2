"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["forecasting_method"] === "string" &&
    answers["forecasting_method"].trim().length > 0 &&
    typeof answers["follow_up_system"] === "string" &&
    answers["follow_up_system"].trim().length > 0 &&
    typeof answers["objection_handling"] === "string" &&
    answers["objection_handling"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: forecasting_method */}
      <MultipleChoiceQuestion
        question="How are you currently forecasting revenue from your pipeline?"
        options={[
          { value: "gut", label: "Based on deal count or gut feel" },
          { value: "weighted", label: "Weighted based on stage or rep judgment" },
          { value: "historical", label: "Based on historical data and trends" },
          { value: "model_driven", label: "Model-driven with real-time updates" },
        ]}
        value={answers["forecasting_method"] || ""}
        onChange={(val) => onAnswer("forecasting_method", val)}
      />

      {/* Question 2: follow_up_system */}
      <MultipleChoiceQuestion
        question="How do you ensure follow-ups and next steps are executed on time?"
        options={[
          { value: "no_system", label: "We don’t have a system" },
          { value: "rep_managed", label: "Reps are responsible, with some reminders" },
          { value: "tools", label: "We use task tools and reminders in our CRM" },
          { value: "automated_workflows", label: "We use automated workflows and alerts" },
        ]}
        value={answers["follow_up_system"] || ""}
        onChange={(val) => onAnswer("follow_up_system", val)}
      />

      {/* Question 3: objection_handling */}
      <MultipleChoiceQuestion
        question="How well does your team manage objections or stalls during the sales process?"
        options={[
          { value: "not_well", label: "We don’t handle them well" },
          { value: "address_basic", label: "We address basic ones with scripts" },
          { value: "objection_library", label: "We maintain an objection handling library" },
          { value: "confident_adaptive", label: "We’re confident and adapt based on context" },
        ]}
        value={answers["objection_handling"] || ""}
        onChange={(val) => onAnswer("objection_handling", val)}
      />
    </div>
  );
}
