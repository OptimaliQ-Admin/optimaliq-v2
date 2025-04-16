"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isScore_4_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["adaptive_governance"] === "string" &&
    answers["adaptive_governance"].trim().length > 0 &&

    typeof answers["ai_automation"] === "string" &&
    answers["ai_automation"].trim().length > 0 &&

    typeof answers["adaptability"] === "string" &&
    answers["adaptability"].trim().length > 0 &&

    typeof answers["sustainability_challenge"] === "string" &&
    answers["sustainability_challenge"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {

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
