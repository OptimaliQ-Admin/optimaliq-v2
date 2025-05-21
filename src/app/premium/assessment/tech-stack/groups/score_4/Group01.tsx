"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["analytics_platform"] === "string" &&
    typeof answers["data_warehouse"] === "string" &&
    typeof answers["real_time_analytics"] === "string"
  );
}

export default function Score4_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How sophisticated is your analytics platform?"
        options={[
          { value: "basic", label: "Basic — standard analytics" },
          { value: "advanced", label: "Advanced — predictive analytics" },
          { value: "enterprise", label: "Enterprise — prescriptive analytics" },
          { value: "cutting_edge", label: "Cutting-edge — autonomous analytics" },
        ]}
        value={getStringAnswer(answers["analytics_platform"])}
        onChange={(val) => onAnswer("analytics_platform", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle data warehousing?"
        options={[
          { value: "traditional", label: "Traditional — relational databases" },
          { value: "modern", label: "Modern — cloud data warehouse" },
          { value: "advanced", label: "Advanced — distributed data lake" },
          { value: "cutting_edge", label: "Cutting-edge — real-time data mesh" },
        ]}
        value={getStringAnswer(answers["data_warehouse"])}
        onChange={(val) => onAnswer("data_warehouse", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement real-time analytics?"
        options={[
          { value: "batch", label: "Batch — scheduled processing" },
          { value: "near_real_time", label: "Near real-time — frequent updates" },
          { value: "real_time", label: "Real-time — streaming analytics" },
          { value: "predictive", label: "Predictive — anticipatory analytics" },
        ]}
        value={getStringAnswer(answers["real_time_analytics"])}
        onChange={(val) => onAnswer("real_time_analytics", val)}
      />
    </div>
  );
} 