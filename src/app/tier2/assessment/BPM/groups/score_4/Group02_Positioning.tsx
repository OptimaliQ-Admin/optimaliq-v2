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

      {/* Question 4: cx_integration */}
<MultipleChoiceQuestion
  question="Do your processes incorporate customer or end-user experience as part of their design?"
  options={[
    { value: "No", label: "No — internal efficiency is the priority" },
    { value: "Occasionally", label: "Occasionally, based on feedback" },
    { value: "Often", label: "Often, as part of updates" },
    { value: "Always", label: "Always — experience is a design priority" },
  ]}
  value={answers["cx_integration"] || ""}
  onChange={(val) => onAnswer("cx_integration", val)}
/>

      {/* Question 5: improvement_cycle */}
      <MultiSelectQuestion
              question="Which of the following are routinely part of your process improvement cycle?"
              options={[
                { value: "Stakeholder input", label: "Stakeholder input" },
                { value: "Cross-functional testing", label: "Cross-functional testing" },
                { value: "Root cause analysis", label: "Root cause analysis" },
                { value: "Automation review", label: "Automation review" },
                { value: "None of these", label: "None of these" },
              ]}
              selected={improvement_cycle}
                    onChange={(val) => onAnswer("improvement_cycle", val)}
                    maxSelect={5}
                  />


      {/* Question 6: adaptive_processes */}
<MultipleChoiceQuestion
  question="Do your business processes adapt dynamically based on customer behavior, volume, or context?"
  options={[
    { value: "No", label: "No — they’re static" },
    { value: "Slightly", label: "Slightly — through branching or roles" },
    { value: "Moderately", label: "Moderately — through conditional logic" },
    { value: "Yes", label: "Yes — dynamic, rule-based, or AI-driven" },
  ]}
  value={answers["adaptive_processes"] || ""}
  onChange={(val) => onAnswer("adaptive_processes", val)}
/>

    </div>
  );
}
