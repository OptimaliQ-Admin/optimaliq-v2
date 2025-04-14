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

      {/* Question 7: knowledge_sharing */}
      <MultiSelectQuestion
        question="How is knowledge about processes shared and maintained across your organization?"
        options={[
          { value: "Word of mouth or informal sharing", label: "Word of mouth or informal sharing" },
          { value: "Internal wikis or SOP libraries", label: "Internal wikis or SOP libraries" },
          { value: "CRM or ERP software", label: "CRM or ERP software" },
          { value: "Structured onboarding and documentation", label: "Structured onboarding and documentation" },
          { value: "Embedded in daily systems and training", label: "Embedded in daily systems and training" },
        ]}
        selected={knowledge_sharing}
              onChange={(val) => onAnswer("knowledge_sharing", val)}
              maxSelect={5}
            />


      {/* Question 8: strategic_alignment */}
      <MultipleChoiceQuestion
        question="How confident are you in your current process stack supporting your company’s long-term strategic goals?"
        options={[
          { value: "Not confident", label: "Not confident" },
          { value: "Somewhat aligned", label: "Somewhat aligned" },
          { value: "Mostly aligned", label: "Mostly aligned" },
          { value: "Fully aligned and designed with strategy in mind", label: "Fully aligned and designed with strategy in mind" },
        ]}
        value={answers["strategic_alignment"] || ""}
        onChange={(val) => onAnswer("strategic_alignment", val)}
      />

      {/* Question 9: goal_focus */}
      <MultipleChoiceQuestion
        question="What is the primary goal of your process improvement efforts today?"
        options={[
          { value: "Reduce costs", label: "Reduce costs" },
          { value: "Increase speed or throughput", label: "Increase speed or throughput" },
          { value: "Improve experience", label: "Improve experience (customer or team)" },
          { value: "Enable scale or innovation", label: "Enable scale or innovation" },
        ]}
        value={answers["goal_focus"] || ""}
        onChange={(val) => onAnswer("goal_focus", val)}
      />



      {/* Question 10: process_gap */}
      <TextAreaQuestion
        question="What’s one area where your process still feels “manual” or outdated — even at your current maturity?"
        placeholder="E.g.,"
        value={answers["process_gap"] || ""}
        onChange={(val) => onAnswer("process_gap", val)}
        maxLength={300}
      />


    </div>
  );
}
