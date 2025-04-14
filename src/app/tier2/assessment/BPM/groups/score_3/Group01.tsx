"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";


export function isGroup01Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["review_frequency"] === "string" &&
    answers["review_frequency"].trim().length > 0 &&

    typeof answers["visual_mapping"] === "string" &&
    answers["visual_mapping"].trim().length > 0 &&

    Array.isArray(answers["mapping_tools"]) &&
    answers["mapping_tools"].length > 0
  );
}




type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  const mapping_tools = answers["mapping_tools"] || [];

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: review_frequency */}
      <MultipleChoiceQuestion
  question="How often are your documented processes reviewed for accuracy or improvement?"
  options={[
    { value: "Never", label: "Rarely or never" },
    { value: "Once per year", label: "Once per year" },
    { value: "Once per quarter", label: "Once per quarter" },
    { value: "Reviewed regularly", label: "Reviewed regularly as part of operations" },
  ]}
  value={answers["review_frequency"] || ""}
  onChange={(val) => onAnswer("review_frequency", val)}
/>




     {/* Question 2: visual_mapping */}
<MultipleChoiceQuestion
  question="Do you have visual process maps (e.g. flowcharts or swimlanes) for any of your business functions?"
  options={[
    { value: "Never", label: "No, only written instructions" },
    { value: "Occasionally", label: "We’ve mapped a few key processes" },
    { value: "Annually", label: "Most major processes are mapped" },
    { value: "Quarterly", label: "Yes, every process is visually documented" },
  ]}
  value={answers["visual_mapping"] || ""}
  onChange={(val) => onAnswer("visual_mapping", val)}
/>


      {/* Question 3: mapping_tools */}
      <MultiSelectQuestion
  question="What tools do you use to map or visualize your workflows?"
  options={[
    { value: "Lucidchart, Miro, or similar", label: "Lucidchart, Miro, or similar" },
    { value: "ClickUp, Notion, or Monday", label: "ClickUp, Notion, or Monday" },
    { value: "Confluence or shared docs", label: "Confluence or shared docs" },
    { value: "Whiteboards or paper", label: "Whiteboards or paper" },
    { value: "We don’t currently map processes", label: "We don’t currently map processes" },
  ]}
  selected={mapping_tools}
        onChange={(val) => onAnswer("mapping_tools", val)}
        maxSelect={5}
      />
    </div>
  );
}
