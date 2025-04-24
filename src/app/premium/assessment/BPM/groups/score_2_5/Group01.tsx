"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import DropdownQuestion from "@/components/questions/DropdownQuestion";


export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["documentation_access"] === "string" &&
    answers["documentation_access"].trim().length > 0 &&

    typeof answers["change_communication"] === "string" &&
    answers["change_communication"].trim().length > 0 &&

    typeof answers["knowledge_gap"] === "string" &&
    answers["knowledge_gap"].trim().length > 0
  );
}




type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  const growthSelected = answers["growth_metrics"] || [];
  const frictionSelected = answers["friction_points"] || [];

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: documentation_access */}
      <MultipleChoiceQuestion
  question="Where are your process documents typically stored or accessed?"
  options={[
    { value: "Scattered", label: "Scattered across email, chat, or drives" },
    { value: "Shared folders", label: "Shared folders or team wikis" },
    { value: "workflow/project management tools", label: "Inside workflow/project management tools" },
    { value: "Centrally documented", label: "Centrally documented and linked to operations" },
  ]}
  value={answers["documentation_access"] || ""}
  onChange={(val) => onAnswer("documentation_access", val)}
/>




     {/* Question 2: change_communication */}
<MultipleChoiceQuestion
  question="When a process changes, how do you communicate updates to your team?"
  options={[
    { value: "don’t have one", label: "We don’t have a formal update process" },
    { value: "announce it in a meeting or email", label: "We announce it in a meeting or email" },
    { value: "update documentation and notify the team", label: "We update documentation and notify the team" },
    { value: "track changes and confirm everyone has adopted them", label: "We track changes and confirm everyone has adopted them" },
  ]}
  value={answers["change_communication"] || ""}
  onChange={(val) => onAnswer("change_communication", val)}
/>


      {/* Question 3: knowledge_gap */}
      <MultipleChoiceQuestion
  question="Are there any “tribal knowledge” tasks that only one or two people know how to do?"
  options={[
    { value: "Yes", label: "Yes — many tasks are like that" },
    { value: "few specialized areas", label: "A few specialized areas only" },
    { value: "working to document those", label: "We’re working to document those" },
    { value: "No", label: "No — everything is documented or trained" },
  ]}
  value={answers["knowledge_gap"] || ""}
  onChange={(val) => onAnswer("knowledge_gap", val)}
/>
    </div>
  );
}
