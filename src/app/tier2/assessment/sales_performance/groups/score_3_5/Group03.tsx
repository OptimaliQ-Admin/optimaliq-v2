"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["coaching_tools"]) &&
    answers["coaching_tools"].length > 0 &&
    typeof answers["automation_opportunity"] === "string" &&
    answers["automation_opportunity"].trim().length > 0 &&
    typeof answers["sales_scaling_confidence"] === "string" &&
    answers["sales_scaling_confidence"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  const tools = answers["coaching_tools"] || [];

  return (
    <div className="space-y-10">

      {/* Question 8: coaching_tools */}
      <MultiSelectQuestion
        question="What systems or tools do you use to coach reps and track performance?"
        options={[
          { value: "spreadsheets", label: "1:1 notes or spreadsheets" },
          { value: "crm_dashboards", label: "CRM dashboards or reports" },
          { value: "scorecards", label: "Rep scorecards with KPIs" },
          { value: "enablement_platform", label: "Sales enablement platform with tracking" },
        ]}
        selected={tools}
        onChange={(val) => onAnswer("coaching_tools", val)}
        maxSelect={4}
      />

      {/* Question 9: automation_opportunity */}
      <TextAreaQuestion
        question="What’s one area of your sales process you’d automate if you could?"
        placeholder="E.g., follow-ups, stage updates, reminders"
        value={answers["automation_opportunity"] || ""}
        onChange={(val) => onAnswer("automation_opportunity", val)}
        maxLength={300}
      />

      {/* Question 10: sales_scaling_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in your sales team’s ability to scale with more leads?"
        options={[
          { value: "not_confident", label: "Not confident — we’re behind or unstructured" },
          { value: "somewhat_ready", label: "Somewhat ready, but we’d need to scramble" },
          { value: "ready_with_limitations", label: "We’re ready with a few key constraints" },
          { value: "fully_confident", label: "Fully confident — we’ve tested this already" },
        ]}
        value={answers["sales_scaling_confidence"] || ""}
        onChange={(val) => onAnswer("sales_scaling_confidence", val)}
      />
    </div>
  );
}
