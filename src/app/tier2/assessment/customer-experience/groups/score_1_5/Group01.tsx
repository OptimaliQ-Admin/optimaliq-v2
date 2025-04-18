"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["workflow_maturity"] === "string" &&
    typeof answers["data_driven"] === "string" &&
    typeof answers["data_quality"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: workflow_maturity */}
      <MultipleChoiceQuestion
        question="How well-defined are your business workflows or processes?"
        options={[
          { value: "not_defined", label: "They’re not defined at all" },
          { value: "loosely_documented", label: "Loosely documented or tribal knowledge" },
          { value: "standardized_key_areas", label: "Standardized in a few key areas" },
          { value: "well_documented", label: "Well-documented and followed" },
        ]}
        value={answers["workflow_maturity"] || ""}
        onChange={(val) => onAnswer("workflow_maturity", val)}
      />

      {/* Question 2: data_driven */}
      <MultipleChoiceQuestion
        question="How would you describe your approach to making business decisions?"
        options={[
          { value: "gut", label: "Mostly gut feel" },
          { value: "some_data", label: "Some data, mostly intuition" },
          { value: "data_guided", label: "We let data guide most decisions" },
          { value: "data_driven", label: "Data is central to all decisions" },
        ]}
        value={answers["data_driven"] || ""}
        onChange={(val) => onAnswer("data_driven", val)}
      />

      {/* Question 3: data_quality */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy and completeness of your business data?"
        options={[
          { value: "not_confident", label: "Not confident" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "mostly_confident", label: "Mostly confident" },
          { value: "very_confident", label: "Very confident — we audit and maintain it regularly" },
        ]}
        value={answers["data_quality"] || ""}
        onChange={(val) => onAnswer("data_quality", val)}
      />
    </div>
  );
}
