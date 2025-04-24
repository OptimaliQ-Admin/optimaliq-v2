"use client";

import React from "react";
import TextAreaQuestion from "src/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "src/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";


export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["process_definition"] === "string" &&
    answers["process_definition"].trim().length > 0 &&

    typeof answers["knowledge_transfer"] === "string" &&
    answers["knowledge_transfer"].trim().length > 0 &&

    typeof answers["consistency"] === "string" &&
    answers["consistency"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};


export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: process_definition */}
      <MultipleChoiceQuestion
  question=" Who defines the steps in your current business processes? "
  options={[
    { value: "based on habits", label: "No one — it’s based on habits" },
    { value: "person defines their own", label: "Each team or person defines their own" },
    { value: "loosely defined by a manager", label: "It’s loosely defined by a manager" },
    { value: "clear owner for each process", label: "There’s a clear owner for each process" },
  ]}
  value={answers["process_definition"] || ""}
  onChange={(val) => onAnswer("process_definition", val)}
/>

{/* Question 5: knowledge_transfer */}
<MultipleChoiceQuestion
  question="  How often do people ask, “How do I do this?” or “What’s the right way to handle this?”  "
  options={[
    { value: "All the time", label: "All the time" },
    { value: "Weekly", label: "Weekly" },
    { value: "Rarely", label: "Rarely" },
    { value: "Almost never", label: "Almost never" },
  ]}
  value={answers["knowledge_transfer"] || ""}
  onChange={(val) => onAnswer("knowledge_transfer", val)}
/>

      {/* Question 6: consistency */}
      <MultipleChoiceQuestion
  question=" How confident are you that critical business activities (like invoicing, outreach, or fulfillment) always follow the same steps? "
  options={[
    { value: "Not confident", label: "Not confident at all" },
    { value: "Somewhat", label: "Somewhat confident" },
    { value: "Mostly", label: "Mostly confident" },
    { value: "Very confident", label: "Very confident" },
  ]}
  value={answers["consistency"] || ""}
  onChange={(val) => onAnswer("consistency", val)}
/>
    </div>
  );
}
