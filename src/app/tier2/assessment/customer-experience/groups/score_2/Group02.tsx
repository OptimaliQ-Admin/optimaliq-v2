"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["team_tech_training"] === "string" &&
    typeof answers["current_stack_limitations"] === "string" &&
    answers["current_stack_limitations"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: team_tech_training */}
      <MultipleChoiceQuestion
        question="How prepared is your team to adopt and use new digital tools or systems?"
        options={[
          { value: "not_prepared", label: "Not very — there’s a steep learning curve" },
          { value: "somewhat_prepared", label: "Somewhat — we get by with trial and error" },
          { value: "mostly_prepared", label: "Mostly — we train teams as needed" },
          { value: "fully_prepared", label: "Very — we have a plan for enablement and adoption" },
        ]}
        value={answers["team_tech_training"] || ""}
        onChange={(val) => onAnswer("team_tech_training", val)}
      />

      {/* Question 5: current_stack_limitations */}
      <TextAreaQuestion
        question="What limitations in your current stack or digital operations are slowing your team down?"
        placeholder="E.g., Duplicate data, disconnected systems, slow processes..."
        value={answers["current_stack_limitations"] || ""}
        onChange={(val) => onAnswer("current_stack_limitations", val)}
        maxLength={300}
      />
    </div>
  );
}
