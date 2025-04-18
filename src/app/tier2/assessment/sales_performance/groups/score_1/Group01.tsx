"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["lead_generation"] === "string" &&
    answers["lead_generation"].trim().length > 0 &&
    typeof answers["sales_process"] === "string" &&
    answers["sales_process"].trim().length > 0 &&
    typeof answers["pipeline_tracking"] === "string" &&
    answers["pipeline_tracking"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: lead_generation */}
      <MultipleChoiceQuestion
        question="How do you currently generate new sales leads or opportunities?"
        options={[
          { value: "referrals", label: "Referrals and word-of-mouth" },
          { value: "outreach", label: "Occasional outreach (emails, cold calls)" },
          { value: "ads_events", label: "Paid ads or events drive most leads" },
          { value: "inbound_engine", label: "We have a consistent inbound engine" },
        ]}
        value={answers["lead_generation"] || ""}
        onChange={(val) => onAnswer("lead_generation", val)}
      />

      {/* Question 2: sales_process */}
      <MultipleChoiceQuestion
        question="Do you have a defined sales process or set of steps that reps follow?"
        options={[
          { value: "no_process", label: "No process — each sale is different" },
          { value: "loose_steps", label: "There are loose steps, but it’s flexible" },
          { value: "defined_stages", label: "Yes, with defined stages and tools" },
          { value: "optimized_process", label: "Yes, and it’s optimized regularly" },
        ]}
        value={answers["sales_process"] || ""}
        onChange={(val) => onAnswer("sales_process", val)}
      />

      {/* Question 3: pipeline_tracking */}
      <MultipleChoiceQuestion
        question="How do you currently track your sales pipeline?"
        options={[
          { value: "no_tracking", label: "We don’t track it" },
          { value: "spreadsheet", label: "Manually in a spreadsheet or doc" },
          { value: "crm_basic", label: "In a CRM but not consistently" },
          { value: "crm_active", label: "In a CRM with real-time updates" },
        ]}
        value={answers["pipeline_tracking"] || ""}
        onChange={(val) => onAnswer("pipeline_tracking", val)}
      />
    </div>
  );
}
