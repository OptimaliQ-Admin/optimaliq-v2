"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitive_review_frequency"] === "string" &&
    Array.isArray(answers["competitive_research_sources"]) &&
    typeof answers["positioning_adaptability"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  const selectedSources = answers["competitive_research_sources"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: competitive_review_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you review competitive positioning or benchmarks?"
        options={[
          { value: "annually", label: "Annually or less" },
          { value: "quarterly", label: "Quarterly during planning cycles" },
          { value: "monthly", label: "Monthly as part of go-to-market alignment" },
          { value: "ongoing", label: "Ongoing — we track in near real time" },
        ]}
        value={answers["competitive_review_frequency"] || ""}
        onChange={(val) => onAnswer("competitive_review_frequency", val)}
      />

      {/* Question 2: competitive_research_sources */}
      <MultiSelectQuestion
        question="Which sources do you rely on for understanding your competitors?"
        options={[
          { value: "newsletters", label: "Industry newsletters or reports" },
          { value: "sales_team", label: "Sales team insights or CRM notes" },
          { value: "customer_feedback", label: "Customer feedback or interviews" },
          { value: "monitoring_tools", label: "Competitive monitoring tools" },
        ]}
        selected={selectedSources}
        onChange={(val) => onAnswer("competitive_research_sources", val)}
        maxSelect={4}
      />

      {/* Question 3: positioning_adaptability */}
      <MultipleChoiceQuestion
        question="How is your messaging or positioning adapted based on competitor movement?"
        options={[
          { value: "not_adjusted", label: "It isn’t — we stay the course" },
          { value: "reactive", label: "We adjust case by case based on what others do" },
          { value: "coordinated", label: "Marketing or sales coordinates shifts based on trends" },
          { value: "proactive", label: "We proactively differentiate based on trends and customer perception" },
        ]}
        value={answers["positioning_adaptability"] || ""}
        onChange={(val) => onAnswer("positioning_adaptability", val)}
      />
    </div>
  );
}
