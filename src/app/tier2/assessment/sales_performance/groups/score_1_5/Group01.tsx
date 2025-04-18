"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["lead_distribution"] === "string" &&
    answers["lead_distribution"].trim().length > 0 &&
    typeof answers["forecast_confidence"] === "string" &&
    answers["forecast_confidence"].trim().length > 0 &&
    Array.isArray(answers["sales_tools"]) &&
    answers["sales_tools"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  const selectedTools = answers["sales_tools"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: lead_distribution */}
      <MultipleChoiceQuestion
        question="How are new leads currently distributed or assigned to your sales team?"
        options={[
          { value: "ad_hoc", label: "Leads are unassigned or handled ad hoc" },
          { value: "manual", label: "They’re assigned manually by a manager" },
          { value: "round_robin", label: "They’re assigned in a round-robin or fair rotation" },
          { value: "automated_rules", label: "They’re routed automatically based on rules or segments" },
        ]}
        value={answers["lead_distribution"] || ""}
        onChange={(val) => onAnswer("lead_distribution", val)}
      />

      {/* Question 2: forecast_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in your ability to predict future revenue from your pipeline?"
        options={[
          { value: "not_confident", label: "Not confident at all" },
          { value: "somewhat", label: "Somewhat — we have basic estimates" },
          { value: "usually_accurate", label: "Usually accurate within a margin" },
          { value: "very_confident", label: "Very confident with strong forecasting accuracy" },
        ]}
        value={answers["forecast_confidence"] || ""}
        onChange={(val) => onAnswer("forecast_confidence", val)}
      />

      {/* Question 3: sales_tools */}
      <MultiSelectQuestion
        question="What systems or tools do you use to manage your sales efforts?"
        options={[
          { value: "crm", label: "CRM (HubSpot, Salesforce, etc.)" },
          { value: "spreadsheets", label: "Spreadsheets or shared docs" },
          { value: "task_tools", label: "Task or project management tools" },
          { value: "notes", label: "Manual notes or email folders" },
          { value: "none", label: "We don’t use tools consistently" },
        ]}
        selected={selectedTools}
        onChange={(val) => onAnswer("sales_tools", val)}
        maxSelect={5}
      />
    </div>
  );
}
