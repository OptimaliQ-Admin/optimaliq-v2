"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["workflow_tools"]) && answers["workflow_tools"].length > 0 &&
    typeof answers["training"] === "string" && answers["training"].trim().length > 0 &&
    typeof answers["self_insight"] === "string" && answers["self_insight"].trim().length > 0 &&
    typeof answers["discipline"] === "string" && answers["discipline"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  const workflow_tools = answers["workflow_tools"] || [];

  return (
    <div className="space-y-10">

      {/* Question 7: workflow_tools */}
      <MultiSelectQuestion
        question=" What tools or platforms do you use to manage and track workflows across your team? "
        options={[
          { value: "Spreadsheets", label: "Spreadsheets" },
          { value: "Project boards", label: "Project boards (e.g., Trello, Asana)" },
          { value: "chat tools", label: "Slack or chat tools" },
          { value: "Email", label: "Email" },
          { value: "workflow software", label: "Dedicated workflow software" },
          { value: "None", label: "None currently" }
        ]}
        selected={workflow_tools}
              onChange={(val) => onAnswer("workflow_tools", val)}
              maxSelect={5}
            />


      {/* Question 8: training */}
      <MultipleChoiceQuestion
        question=" How do you train new team members on how to follow existing processes? "
        options={[
          { value: "Verbal", label: "Verbal instructions only" },
          { value: "Shadowing", label: "Shadowing a current employee" },
          { value: "documents or checklists", label: "We give them documents or checklists" },
          { value: "structured onboarding plan", label: "We follow a structured onboarding plan" },
        ]}
        value={answers["training"] || ""}
        onChange={(val) => onAnswer("training", val)}
      />

      {/* Question 9: self_insight */}
      <TextAreaQuestion
        question=" What’s one process you wish was more efficient or reliable in your business right now? "
        placeholder="E.g.,"
        value={answers["self_insight"] || ""}
        onChange={(val) => onAnswer("self_insight", val)}
        maxLength={300}
      />



      {/* Question 10: discipline */}
      <MultipleChoiceQuestion
        question=" How would you describe your current level of process discipline across the company? "
        options={[
          { value: "Very informal", label: "Very informal — depends on who’s involved" },
          { value: "Semi-consistent", label: "Semi-consistent, but not always followed" },
          { value: "Mostly standardized", label: "Mostly standardized in key areas" },
          { value: "Well-defined", label: "Well-defined and reliable across the board" },
        ]}
        value={answers["discipline"] || ""}
        onChange={(val) => onAnswer("discipline", val)}
      />

    </div>
  );
}
