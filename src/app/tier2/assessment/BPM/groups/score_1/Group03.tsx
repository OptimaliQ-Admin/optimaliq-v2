"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ownership"] === "string" &&
    answers["ownership"].trim().length > 0 &&

    typeof answers["self_diagnosis"] === "string" &&
    answers["self_diagnosis"].trim().length > 0 &&

    typeof answers["operations_maturity"] === "string" &&
    answers["operations_maturity"].trim().length > 0
  );
}


type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  const techSelected = answers["tech_stack"] || [];

  return (
    <div className="space-y-10">

      {/* Question 8: ownership */}
      <MultipleChoiceQuestion
        question="Do you know who is responsible for each part of your main workflows (like customer service or fulfillment)?"
        options={[
          { value: "no_ownership", label: "No clear ownership" },
          { value: "Somewhat", label: "Somewhat — it depends on the day" },
          { value: "Mostly", label: "Mostly clear roles" },
          { value: "exactly", label: "Everyone knows exactly what they own" },
        ]}
        value={answers["ownership"] || ""}
        onChange={(val) => onAnswer("ownership", val)}
      />

      {/* Question 9: self_diagnosis */}
      <TextAreaQuestion
        question="If you wanted to improve how something gets done in your business, where would you start?"
        placeholder="E.g.,"
        value={answers["self_diagnosis"] || ""}
        onChange={(val) => onAnswer("self_diagnosis", val)}
        maxLength={300}
      />



      {/* Question 10: operations_maturity */}
      <MultipleChoiceQuestion
        question="How would you describe your current approach to managing day-to-day business operations?"
        options={[
          { value: "reactive", label: "Mostly reactive — we fix problems as they come" },
          { value: "Some_systems", label: "Some systems, but things fall through" },
          { value: "Organized_informal", label: "Organized, but informal" },
          { value: "structured", label: "Very structured and proactive" },
        ]}
        value={answers["operations_maturity"] || ""}
        onChange={(val) => onAnswer("operations_maturity", val)}
      />

    </div>
  );
}
