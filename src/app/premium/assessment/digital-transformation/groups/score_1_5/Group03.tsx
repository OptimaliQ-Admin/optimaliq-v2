"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tool_adoption"] === "string" &&
    typeof answers["roadmap_alignment"] === "string" &&
    typeof answers["digital_metrics"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: tool_adoption */}
      <MultipleChoiceQuestion
        question="How consistent is adoption of digital tools across your teams?"
        options={[
          { value: "low_adoption", label: "Low — only a few use them" },
          { value: "inconsistent", label: "Inconsistent — usage varies by person or team" },
          { value: "mostly_used", label: "Mostly adopted — some gaps remain" },
          { value: "fully_adopted", label: "Fully adopted — it’s part of daily work" },
        ]}
        value={getStringAnswer(answers["tool_adoption"])}
        onChange={(val) => onAnswer("tool_adoption", val)}
      />

      {/* Question 9: roadmap_alignment */}
      <MultipleChoiceQuestion
        question="Do your digital investments align with your business roadmap?"
        options={[
          { value: "no_alignment", label: "No — it feels ad hoc or reactive" },
          { value: "some_alignment", label: "Somewhat — leadership sees the value" },
          { value: "aligned", label: "Yes — we connect projects to strategic goals" },
          { value: "deeply_aligned", label: "Deeply aligned — digital is core to our roadmap" },
        ]}
        value={getStringAnswer(answers["roadmap_alignment"])}
        onChange={(val) => onAnswer("roadmap_alignment", val)}
      />

      {/* Question 10: digital_metrics */}
      <MultipleChoiceQuestion
        question="Do you track success metrics for your digital projects?"
        options={[
          { value: "no_metrics", label: "No — we don’t really track outcomes" },
          { value: "basic_tracking", label: "We track some basic KPIs" },
          { value: "metrics_reviewed", label: "Yes — we review success regularly" },
          { value: "impact_driven", label: "Yes — results guide future investments" },
        ]}
        value={getStringAnswer(answers["digital_metrics"])}
        onChange={(val) => onAnswer("digital_metrics", val)}
      />
    </div>
  );
}
