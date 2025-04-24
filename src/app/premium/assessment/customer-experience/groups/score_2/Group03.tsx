"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["customer_retention_focus"] === "string" &&
    typeof answers["team_cx_alignment"] === "string" &&
    typeof answers["cx_reporting"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score_2_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: customer_retention_focus */}
      <MultipleChoiceQuestion
        question="How much focus does your team place on customer retention?"
        options={[
          { value: "very_little", label: "Very little — we mainly focus on new customer acquisition" },
          { value: "some_focus", label: "Some — we try to follow up and offer promotions" },
          { value: "dedicated_efforts", label: "Dedicated efforts — we track retention and take action" },
          { value: "strategic_retention", label: "It’s a strategic priority with campaigns and KPIs" },
        ]}
        value={answers["customer_retention_focus"] || ""}
        onChange={(val) => onAnswer("customer_retention_focus", val)}
      />

      {/* Question 9: team_cx_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your teams (marketing, sales, support) on delivering a consistent customer experience?"
        options={[
          { value: "no_alignment", label: "Not aligned — each team works in silos" },
          { value: "occasional_alignment", label: "Occasionally aligned — we share updates across teams" },
          { value: "mostly_aligned", label: "Mostly aligned — some shared goals or processes" },
          { value: "fully_aligned", label: "Fully aligned — we collaborate closely on CX delivery" },
        ]}
        value={answers["team_cx_alignment"] || ""}
        onChange={(val) => onAnswer("team_cx_alignment", val)}
      />

      {/* Question 10: cx_reporting */}
      <MultipleChoiceQuestion
        question="How do you track and report on customer experience performance?"
        options={[
          { value: "no_tracking", label: "We don’t really track it" },
          { value: "ad_hoc", label: "Ad hoc — based on feedback or complaints" },
          { value: "basic_reporting", label: "Basic reporting — some metrics reviewed regularly" },
          { value: "advanced_reporting", label: "Advanced — clear KPIs tracked across the journey" },
        ]}
        value={answers["cx_reporting"] || ""}
        onChange={(val) => onAnswer("cx_reporting", val)}
      />
    </div>
  );
}
