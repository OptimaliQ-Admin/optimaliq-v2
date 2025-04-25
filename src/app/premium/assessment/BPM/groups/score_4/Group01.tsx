"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["process_redesign"] === "string" &&
    answers["process_redesign"].trim().length > 0 &&

    typeof answers["owner_accountability"] === "string" &&
    answers["owner_accountability"].trim().length > 0 &&

    typeof answers["tool_alignment"] === "string" &&
    answers["tool_alignment"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: process_redesign */}
      <MultipleChoiceQuestion
  question="How often do you actively redesign or re-engineer a process to improve efficiency or experience?"
  options={[
    { value: "Rarely", label: "Rarely — only when needed" },
    { value: "Annually", label: "Annually as part of planning" },
    { value: "Quarterly", label: "Quarterly based on metrics" },
    { value: "Continuously", label: "Continuously, as part of operations" },
  ]}
  value={getStringAnswer(answers["process_redesign"])}
  onChange={(val) => onAnswer("process_redesign", val)}
/>



     {/* Question 2: owner_accountability */}
<MultipleChoiceQuestion
  question="Do process owners have KPIs tied to process performance (e.g. time savings, SLA adherence, error reduction)?"
  options={[
    { value: "No", label: "No — not part of performance review" },
    { value: "Only at a high level", label: "Only at a high level" },
    { value: "KPIs are process-based", label: "Some KPIs are process-based" },
    { value: "Yes", label: "Yes — directly accountable to metrics" },
  ]}
  value={getStringAnswer(answers["owner_accountability"])}
  onChange={(val) => onAnswer("owner_accountability", val)}
/>


      {/* Question 3: tool_alignment */}
      <MultipleChoiceQuestion
  question="How do you ensure alignment between your business tools (CRM, project tools, help desk) and your core processes?"
  options={[
    { value: "Tools and processes are separate", label: "Tools and processes are separate" },
    { value: "Alignment is reviewed during tool onboarding", label: "Alignment is reviewed during tool onboarding" },
    { value: "Regular syncs to maintain alignment", label: "Regular syncs to maintain alignment" },
    { value: "Full alignment strategy and governance", label: "Full alignment strategy and governance" },
  ]}
  value={getStringAnswer(answers["tool_alignment"])}
  onChange={(val) => onAnswer("tool_alignment", val)}
/>
    </div>
  );
}
