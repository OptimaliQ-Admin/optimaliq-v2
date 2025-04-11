"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["tech_stack"]) && answers["tech_stack"].length > 0 &&

    Array.isArray(answers["business_priorities"]) && answers["business_priorities"].length > 0 &&

    typeof answers["process_discipline"] === "string" && answers["process_discipline"].trim().length > 0
  );
}


type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group03_Operations({ answers, onAnswer }: Props) {
  const techSelected = answers["tech_stack"] || [];

  return (
    <div className="space-y-10">

      {/* Question 7: adaptive_governance */}
      <MultipleChoiceQuestion
        question="How do you ensure that your processes evolve alongside changes in customer behavior, regulations, or market shifts?"
        options={[
          { value: "We update as needed", label: "We update as needed" },
          { value: "We review them annually", label: "We review them annually" },
          { value: "We monitor signals and review quarterly", label: "We monitor signals and review quarterly" },
          { value: "We have adaptive frameworks built into governance", label: "We have adaptive frameworks built into governance" },
        ]}
        value={answers["adaptive_governance"] || ""}
        onChange={(val) => onAnswer("adaptive_governance", val)}
      />


      {/* Question 8: ai_automation */}
      <MultipleChoiceQuestion
        question="To what extent are automation, AI, or low-code tools part of your ongoing BPM strategy?"
        options={[
          { value: "Not part of our strategy", label: "Not part of our strategy" },
          { value: "Used in a few areas", label: "Used in a few areas" },
          { value: "Actively expanding across departments", label: "Actively expanding across departments" },
          { value: "Deeply integrated into all core processes", label: "Deeply integrated into all core processes" },
        ]}
        value={answers["ai_automation"] || ""}
        onChange={(val) => onAnswer("ai_automation", val)}
      />

      {/* Question 9: adaptability */}
      <MultipleChoiceQuestion
        question="When your business adds a new system, product, or team, how easily can your existing processes adapt?"
        options={[
          { value: "Requires significant rework", label: "Requires significant rework" },
          { value: "Adaptable with some effort", label: "Adaptable with some effort" },
          { value: "Processes are built to flex", label: "Processes are built to flex" },
          { value: "Fully modular and scalable by design", label: "Fully modular and scalable by design" },
        ]}
        value={answers["adaptability"] || ""}
        onChange={(val) => onAnswer("adaptability", val)}
      />



      {/* Question 10: sustainability_challenge */}
      <TextAreaQuestion
        question="What is your greatest challenge in sustaining high BPM performance across the organization?"
        placeholder="E.g.,"
        value={answers["sustainability_challenge"] || ""}
        onChange={(val) => onAnswer("sustainability_challenge", val)}
        maxLength={300}
      />

    </div>
  );
}
