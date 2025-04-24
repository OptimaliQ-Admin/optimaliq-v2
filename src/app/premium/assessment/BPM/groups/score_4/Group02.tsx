"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_integration"] === "string" &&
    answers["cx_integration"].trim().length > 0 &&

    Array.isArray(answers["improvement_cycle"]) &&
    answers["improvement_cycle"].length > 0 &&

    typeof answers["adaptive_processes"] === "string" &&
    answers["adaptive_processes"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Score4_Step02({ answers, onAnswer }: Props) {
  const improvement_cycle = answers["improvement_cycle"] || [];
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
  value={getStringAnswer(answers["cx_integration"])}
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
  value={getStringAnswer(answers["adaptive_processes"])}
  onChange={(val) => onAnswer("adaptive_processes", val)}
/>

    </div>
  );
}
