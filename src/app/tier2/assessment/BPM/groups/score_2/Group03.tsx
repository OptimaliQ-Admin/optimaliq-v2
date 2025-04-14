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

      {/* Question 7: task_tracking */}
      <MultiSelectQuestion
        question="What systems or tools do you use to track the status of key business tasks?"
        options={[
          { value: "Spreadsheets", label: "Email or chat" },
          { value: "Project boards", label: "Project management tools (Trello, Monday)" },
          { value: "chat tools", label: "CRM or ERP software" },
          { value: "Email", label: "Custom dashboards or trackers" },
          { value: "workflow software", label: "We don’t track task status formally" },
        ]}
        selected={task_tracking}
              onChange={(val) => onAnswer("task_tracking", val)}
              maxSelect={5}
            />


      {/* Question 8: metrics */}
      <MultipleChoiceQuestion
        question="Do you track any metrics related to your business processes (e.g. time to complete, error rate, volume)?"
        options={[
          { value: "No tracking", label: "No tracking at all" },
          { value: "occasionally", label: "Only informally or occasionally" },
          { value: "basic metrics in reports", label: "Some basic metrics in reports" },
          { value: "we monitor and review metrics", label: "Yes — we monitor and review metrics" },
        ]}
        value={answers["metrics"] || ""}
        onChange={(val) => onAnswer("metrics", val)}
      />

      {/* Question 9: challenge */}
      <TextAreaQuestion
        question="What’s the biggest challenge you face in making sure processes are followed?"
        placeholder="E.g.,"
        value={answers["challenge"] || ""}
        onChange={(val) => onAnswer("challenge", val)}
        maxLength={300}
      />



      {/* Question 10: discipline */}
      <MultipleChoiceQuestion
        question="How confident are you that your current processes are scalable as the business grows?"
        options={[
          { value: "Not confident", label: "Not confident at all" },
          { value: "Somewhat", label: "Somewhat confident" },
          { value: "Mostly", label: "Mostly confident" },
          { value: "Very confident", label: "Very confident" },
        ]}
        value={answers["discipline"] || ""}
        onChange={(val) => onAnswer("discipline", val)}
      />

    </div>
  );
}
