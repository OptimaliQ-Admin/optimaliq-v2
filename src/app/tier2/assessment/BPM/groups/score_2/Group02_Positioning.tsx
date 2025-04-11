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

      {/* Question 4: compliance */}
<MultipleChoiceQuestion
  question="How do you ensure that team members are actually following the defined process?"
  options={[
    { value: "We don’t", label: "We don’t verify it" },
    { value: "spot check occasionally", label: "We spot check occasionally" },
    { value: "review it during team syncs", label: "We review it during team syncs" },
    { value: "tracking tools and reporting", label: "We use tracking tools and reporting" },
  ]}
  value={answers["compliance"] || ""}
  onChange={(val) => onAnswer("compliance", val)}
/>

      {/* Question 5: clarity */}
      <MultipleChoiceQuestion
  question="Do your processes include clear steps, roles, and expected outcomes?"
  options={[
    { value: "No", label: "No — they’re more like rough guidelines" },
    { value: "Somewhat", label: "Somewhat — roles and steps are outlined" },
    { value: "Mostly", label: "Mostly — they’re detailed but not always used" },
    { value: "Yes", label: "Yes — they’re fully defined and referenced" },
  ]}
  value={answers["clarity"] || ""}
  onChange={(val) => onAnswer("clarity", val)}
/>


      {/* Question 6: issue_response */}
<MultipleChoiceQuestion
  question="When a process breaks down (e.g. delay, error, missed task), how do you respond?"
  options={[
    { value: "fix it and move on", label: "We just fix it and move on" },
    { value: "try to understand what went wrong", label: "We try to understand what went wrong" },
    { value: "discuss it as a team", label: "We discuss it as a team" },
    { value: "We adjust the process to prevent recurrence", label: "We adjust the process to prevent recurrence" },
  ]}
  value={answers["issue_response"] || ""}
  onChange={(val) => onAnswer("issue_response", val)}
/>

    </div>
  );
}
