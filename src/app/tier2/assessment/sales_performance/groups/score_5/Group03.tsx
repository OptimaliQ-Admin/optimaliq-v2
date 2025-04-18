"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["reinvestment_posture"] === "string" &&
    answers["reinvestment_posture"].trim().length > 0 &&
    typeof answers["sales_engine_strength"] === "string" &&
    answers["sales_engine_strength"].trim().length > 0 &&
    typeof answers["sales_org_vision"] === "string" &&
    answers["sales_org_vision"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: reinvestment_posture */}
      <MultipleChoiceQuestion
        question="What’s your organization’s posture toward reinvesting in sales excellence?"
        options={[
          { value: "focus_now", label: "We’re focused on what works now" },
          { value: "discuss_innovation", label: "We discuss innovation occasionally" },
          { value: "actively_experimenting", label: "We’re actively experimenting and evolving" },
          { value: "building_sales_moat", label: "We’re building a sales excellence moat" },
        ]}
        value={answers["reinvestment_posture"] || ""}
        onChange={(val) => onAnswer("reinvestment_posture", val)}
      />

      {/* Question 9: sales_engine_strength */}
      <TextAreaQuestion
        question="What part of your sales engine do you believe is your greatest strength today?"
        placeholder="E.g., discovery, product demo, outbound, customer success handoff"
        value={answers["sales_engine_strength"] || ""}
        onChange={(val) => onAnswer("sales_engine_strength", val)}
        maxLength={300}
      />

      {/* Question 10: sales_org_vision */}
      <TextAreaQuestion
        question="What’s your vision for how your sales organization will evolve in the next 12–24 months?"
        placeholder="E.g., new verticals, full lifecycle ownership, predictive tooling, etc."
        value={answers["sales_org_vision"] || ""}
        onChange={(val) => onAnswer("sales_org_vision", val)}
        maxLength={300}
      />
    </div>
  );
}
