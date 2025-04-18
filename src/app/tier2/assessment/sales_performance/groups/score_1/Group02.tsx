"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ownership"] === "string" &&
    answers["ownership"].trim().length > 0 &&
    typeof answers["follow_up_consistency"] === "string" &&
    answers["follow_up_consistency"].trim().length > 0 &&
    typeof answers["qualification_method"] === "string" &&
    answers["qualification_method"].trim().length > 0 &&
    Array.isArray(answers["tracked_metrics"]) &&
    answers["tracked_metrics"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  const tracked = answers["tracked_metrics"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: ownership */}
      <MultipleChoiceQuestion
        question="Who in your organization is responsible for closing deals?"
        options={[
          { value: "founder", label: "The founder or owner" },
          { value: "one_salesperson", label: "One salesperson" },
          { value: "team", label: "A sales team with shared ownership" },
          { value: "clearly_defined_roles", label: "Clearly defined roles and handoffs" },
        ]}
        value={answers["ownership"] || ""}
        onChange={(val) => onAnswer("ownership", val)}
      />

      {/* Question 5: follow_up_consistency */}
      <MultipleChoiceQuestion
        question="How consistently do you follow up with leads or open opportunities?"
        options={[
          { value: "inconsistent", label: "Inconsistently or not at all" },
          { value: "try_to_follow", label: "We try, but it’s not systematic" },
          { value: "some_structure", label: "We have some structure and reminders" },
          { value: "highly_disciplined", label: "We have a highly disciplined follow-up process" },
        ]}
        value={answers["follow_up_consistency"] || ""}
        onChange={(val) => onAnswer("follow_up_consistency", val)}
      />

      {/* Question 6: qualification_method */}
      <MultipleChoiceQuestion
        question="Which of the following best describes how you qualify leads?"
        options={[
          { value: "anyone_interested", label: "We talk to anyone interested" },
          { value: "ask_basic_questions", label: "We ask a few basic questions" },
          { value: "criteria_based", label: "We use defined qualification criteria" },
          { value: "formal_scoring", label: "We use a formal scoring model or methodology" },
        ]}
        value={answers["qualification_method"] || ""}
        onChange={(val) => onAnswer("qualification_method", val)}
      />

      {/* Question 7: tracked_metrics */}
      <MultiSelectQuestion
        question="Which of the following do you currently track for your sales team?"
        options={[
          { value: "lead_sources", label: "Lead sources" },
          { value: "conversion_rates", label: "Deal stage conversion rates" },
          { value: "cycle_length", label: "Sales cycle length" },
          { value: "rep_activity", label: "Rep activity (calls, meetings, etc.)" },
          { value: "close_rate", label: "Close rate" },
          { value: "none", label: "We don’t track much right now" },
        ]}
        selected={tracked}
        onChange={(val) => onAnswer("tracked_metrics", val)}
        maxSelect={6}
      />
    </div>
  );
}
