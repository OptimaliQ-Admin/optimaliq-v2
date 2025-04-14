"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";


export function isGroup02Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["differentiator"] === "string" &&
    answers["differentiator"].trim().length > 0 &&

    typeof answers["brand_perception"] === "string" &&
    answers["brand_perception"].trim().length > 0 &&

    typeof answers["strategy_decision_method"] === "string" &&
    answers["strategy_decision_method"].trim().length > 0
  );
}


type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};


export default function Group02_Positioning({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      {/* Question 4: error_handling */}
<MultipleChoiceQuestion
  question="Have you ever had work go wrong because someone did a task differently than expected? "
  options={[
    { value: "frequently", label: "Yes, frequently" },
    { value: "Occasionally", label: "Occasionally" },
    { value: "Rarely", label: "Rarely" },
    { value: "Never", label: "Never" },
  ]}
  value={answers["error_handling"] || ""}
  onChange={(val) => onAnswer("error_handling", val)}
/>

      {/* Question 5: reflection */}
<TextAreaQuestion
  question=" What’s one area of your business that often feels inconsistent or disorganized? "
  placeholder="E.g., documentation."
  value={answers["reflection"] || ""}
  onChange={(val) => onAnswer("reflection", val)}
  maxLength={300}
/>


      {/* Question 6: Strategic Decision-Making */}
<MultipleChoiceQuestion
  question="How do you usually find out if something wasn’t done properly or got missed?"
  options={[
    { value: "unhappy_customer", label: "We hear from an unhappy customer" },
    { value: "someone_notices", label: "Someone on the team notices" },
    { value: "manually", label: "We review manually" },
    { value: "reports", label: "We use reports or systems" },
  ]}
  value={answers["issue_detection"] || ""}
  onChange={(val) => onAnswer("issue_detection", val)}
/>

{/* Question 7: tools */}
<MultiSelectQuestion
  question=" Which tools, if any, does your team use to track tasks or processes?"
  options={[
    { value: "Email", label: "Email" },
    { value: "Spreadsheets", label: "Spreadsheets" },
    { value: "Shared_documents", label: "Shared documents" },
    { value: "Project_management", label: "Project management tools (e.g. Trello, Asana)" },
    { value: "None", label: "None right now" },
  ]}
  selected={tools}
        onChange={(val) => onAnswer("tools", val)}
        maxSelect={5}
      />
    </div>
  );
}
