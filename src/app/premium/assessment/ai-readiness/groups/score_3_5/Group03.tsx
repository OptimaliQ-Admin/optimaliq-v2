"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_change_management"] === "string" &&
    typeof answers["ai_cost_impact"] === "string" &&
    typeof answers["ai_scalability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_change_management */}
      <MultipleChoiceQuestion
        question="What systems do you have in place to manage change related to AI implementation?"
        options={[
          { value: "no_process", label: "We don’t have a structured change process" },
          { value: "basic_alignment", label: "Basic alignment across stakeholders" },
          { value: "formal_change_process", label: "Formalized process including risk analysis" },
          { value: "change_governance", label: "Full change governance with tracking and communication plans" },
        ]}
        value={getStringAnswer(answers["ai_change_management"])}
        onChange={(val) => onAnswer("ai_change_management", val)}
      />

      {/* Question 9: ai_cost_impact */}
      <MultipleChoiceQuestion
        question="How do you measure the cost vs. impact of AI initiatives?"
        options={[
          { value: "no_tracking", label: "We don’t really track cost/impact" },
          { value: "rough_estimates", label: "Rough estimates post-implementation" },
          { value: "roi_tracked", label: "We track ROI on major AI investments" },
          { value: "cost_impact_modeling", label: "We use cost-impact modeling pre and post implementation" },
        ]}
        value={getStringAnswer(answers["ai_cost_impact"])}
        onChange={(val) => onAnswer("ai_cost_impact", val)}
      />

      {/* Question 10: ai_scalability */}
      <MultipleChoiceQuestion
        question="How scalable are your current AI solutions?"
        options={[
          { value: "not_scalable", label: "They aren’t — built for one use case" },
          { value: "somewhat_scalable", label: "Some are repeatable, but not systemized" },
          { value: "scalable_framework", label: "We use frameworks that support scaling AI use" },
          { value: "enterprise_scale", label: "We build and deploy AI at enterprise scale" },
        ]}
        value={getStringAnswer(answers["ai_scalability"])}
        onChange={(val) => onAnswer("ai_scalability", val)}
      />
    </div>
  );
}
