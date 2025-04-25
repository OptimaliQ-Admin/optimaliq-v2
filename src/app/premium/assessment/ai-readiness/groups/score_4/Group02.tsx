"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_budget_allocation"] === "string" &&
    typeof answers["ai_oversight"] === "string" &&
    typeof answers["ai_model_monitoring"] === "string" &&
    typeof answers["data_quality_management"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_budget_allocation */}
      <MultipleChoiceQuestion
        question="How is budget allocated for AI initiatives?"
        options={[
          { value: "no_dedicated_budget", label: "No dedicated budget for AI" },
          { value: "project_based", label: "Budget is allocated project by project" },
          { value: "functional_investment", label: "Functional teams receive AI funding" },
          { value: "strategic_funding", label: "AI is funded as a strategic priority" },
        ]}
        value={getStringAnswer(answers["ai_budget_allocation"])}
        onChange={(val) => onAnswer("ai_budget_allocation", val)}
      />

      {/* Question 5: ai_oversight */}
      <MultipleChoiceQuestion
        question="Who oversees AI deployment and ethical risk management?"
        options={[
          { value: "no_oversight", label: "No one is formally assigned" },
          { value: "manager_level", label: "Manager-level oversight only" },
          { value: "designated_lead", label: "A designated lead or committee exists" },
          { value: "cross_functional_board", label: "A cross-functional board oversees AI ethics and risk" },
        ]}
        value={getStringAnswer(answers["ai_oversight"])}
        onChange={(val) => onAnswer("ai_oversight", val)}
      />

      {/* Question 6: ai_model_monitoring */}
      <MultipleChoiceQuestion
        question="How are AI models monitored once deployed?"
        options={[
          { value: "not_monitored", label: "They're not monitored" },
          { value: "manual_review", label: "Occasional manual review" },
          { value: "basic_logging", label: "Basic logging and alerting in place" },
          { value: "automated_monitoring", label: "Automated monitoring with KPIs and thresholds" },
        ]}
        value={getStringAnswer(answers["ai_model_monitoring"])}
        onChange={(val) => onAnswer("ai_model_monitoring", val)}
      />

      {/* Question 7: data_quality_management */}
      <MultipleChoiceQuestion
        question="What practices are in place for data quality and integrity?"
        options={[
          { value: "no_practices", label: "None — data is used as-is" },
          { value: "basic_cleaning", label: "Some basic cleaning and validation" },
          { value: "standard_checks", label: "We follow standards for quality checks" },
          { value: "governed_framework", label: "Governed framework with owners and audits" },
        ]}
        value={getStringAnswer(answers["data_quality_management"])}
        onChange={(val) => onAnswer("data_quality_management", val)}
      />
    </div>
  );
}
