"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmarking_frequency"] === "string" &&
    typeof answers["competitive_data_depth"] === "string" &&
    typeof answers["benchmarking_tools"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_4_9_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: benchmarking_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you conduct competitive benchmarking?"
        options={[
          { value: "rarely", label: "Rarely — maybe once a year" },
          { value: "quarterly", label: "Quarterly or when major changes happen" },
          { value: "monthly", label: "Monthly — part of regular review" },
          { value: "continuous", label: "Continuously — always monitoring and comparing" },
        ]}
        value={getStringAnswer(answers["benchmarking_frequency"])}
        onChange={(val) => onAnswer("benchmarking_frequency", val)}
      />

      {/* Question 2: competitive_data_depth */}
      <MultipleChoiceQuestion
        question="How deep is your competitive data and insight?"
        options={[
          { value: "basic_public_info", label: "Basic — just public info and pricing" },
          { value: "surface_level_analysis", label: "Surface-level analysis — positioning and marketing" },
          { value: "functional_differentiation", label: "Functional — features and capabilities" },
          { value: "strategic_insight", label: "Strategic — we understand their moves and weaknesses" },
        ]}
        value={getStringAnswer(answers["competitive_data_depth"])}
        onChange={(val) => onAnswer("competitive_data_depth", val)}
      />

      {/* Question 3: benchmarking_tools */}
      <MultipleChoiceQuestion
        question="Which tools or platforms do you use for competitive benchmarking?"
        options={[
          { value: "none", label: "None — it's manual or ad hoc" },
          { value: "basic_tools", label: "Basic tools — Google, pricing spreadsheets" },
          { value: "benchmarking_platforms", label: "Benchmarking platforms or services (e.g., Similarweb, Crayon)" },
          { value: "custom_dashboard", label: "Custom dashboards or BI integration" },
        ]}
        value={getStringAnswer(answers["benchmarking_tools"])}
        onChange={(val) => onAnswer("benchmarking_tools", val)}
      />
    </div>
  );
}
