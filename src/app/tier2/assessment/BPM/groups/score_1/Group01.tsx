"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";


export function isGroup01Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["consistency"] === "string" &&
    answers["consistency"].trim().length > 0 &&
    typeof answers["documentation"] === "string" &&
    answers["documentation"].trim().length > 0 &&
    typeof answers["onboarding"] === "string" &&
    answers["onboarding"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  const growthSelected = answers["growth_metrics"] || [];
  const frictionSelected = answers["friction_points"] || [];

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: consistency */}
<MultipleChoiceQuestion
  question="How do you currently ensure that recurring tasks (like onboarding a client or fulfilling an order) are done the same way every time? "
  options={[
    { value: "own_way", label: "Each person has their own way" },
    { value: "experience_memory", label: "We rely on experience or memory" },
    { value: "checklisr", label: "There’s a checklist or basic notes" },
    { value: "software", label: "We use software or formal instructions" },
  ]}
  value={answers["consistency"] || ""}
  onChange={(val) => onAnswer("consistency", val)}
/>



     {/* Question 2: documentation */}
<MultipleChoiceQuestion
  question="Do you have any processes written down for how things should be done in your business?"
  options={[
    { value: "Nothing", label: "No, nothing is documented" },
    { value: "few", label: "A few things are written down" },
    { value: "most", label: "Most core processes are documented" },
    { value: "everything", label: "Everything is clearly documented and stored" },
  ]}
  value={answers["documentation"] || ""}
  onChange={(val) => onAnswer("documentation", val)}
/>


      {/* Question 3: onboarding */}
      <MultipleChoiceQuestion
  question="If someone new joined your team today, how would they know what to do in their role? "
  options={[
    { value: "ask_someone", label: "They would ask someone" },
    { value: "watch", label: "They’d watch others or figure it out" },
    { value: "tips", label: "We'd give them a few tips or notes" },
    { value: "training", label: "They’d receive a clear training or guide" },
  ]}
  value={answers["onboarding"] || ""}
  onChange={(val) => onAnswer("onboarding", val)}
/>

    </div>
  );
}
