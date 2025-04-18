"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["stage_definition"] === "string" &&
    answers["stage_definition"].trim().length > 0 &&
    typeof answers["forecast_accuracy"] === "string" &&
    answers["forecast_accuracy"].trim().length > 0 &&
    typeof answers["lead_prioritization"] === "string" &&
    answers["lead_prioritization"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: stage_definition */}
      <MultipleChoiceQuestion
        question="How clearly are your sales stages defined (e.g., Discovery, Proposal, Closed)?"
        options={[
          { value: "not_defined", label: "Not defined" },
          { value: "loosely_defined", label: "Some stages are loosely defined" },
          { value: "clearly_defined", label: "They’re clearly defined but not always followed" },
          { value: "well_enforced", label: "They’re defined and consistently followed" },
        ]}
        value={answers["stage_definition"] || ""}
        onChange={(val) => onAnswer("stage_definition", val)}
      />

      {/* Question 2: forecast_accuracy */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy of your sales forecast?"
        options={[
          { value: "not_accurate", label: "Not accurate at all" },
          { value: "somewhat_accurate", label: "Somewhat accurate" },
          { value: "usually_accurate", label: "Usually accurate" },
          { value: "very_confident", label: "Very confident with consistent results" },
        ]}
        value={answers["forecast_accuracy"] || ""}
        onChange={(val) => onAnswer("forecast_accuracy", val)}
      />

      {/* Question 3: lead_prioritization */}
      <MultipleChoiceQuestion
        question="How do you prioritize leads or accounts in your pipeline?"
        options={[
          { value: "work_recent", label: "We work whatever is most recent" },
          { value: "gut_feel", label: "We prioritize based on gut feel or rep preference" },
          { value: "firmographics", label: "We use basic firmographics or engagement signals" },
          { value: "scoring_model", label: "We use lead/account scoring to prioritize" },
        ]}
        value={answers["lead_prioritization"] || ""}
        onChange={(val) => onAnswer("lead_prioritization", val)}
      />
    </div>
  );
}
