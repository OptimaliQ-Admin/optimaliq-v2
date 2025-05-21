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

export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["business_intelligence"] === "string" &&
    typeof answers["data_visualization"] === "string" &&
    typeof answers["decision_support"] === "string"
  );
}

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How sophisticated is your business intelligence?"
        options={[
          { value: "basic", label: "Basic — standard reporting" },
          { value: "advanced", label: "Advanced — interactive analytics" },
          { value: "sophisticated", label: "Sophisticated — predictive BI" },
          { value: "cutting_edge", label: "Cutting-edge — autonomous BI" },
        ]}
        value={getStringAnswer(answers["business_intelligence"])}
        onChange={(val) => onAnswer("business_intelligence", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle data visualization?"
        options={[
          { value: "basic", label: "Basic — static charts" },
          { value: "interactive", label: "Interactive — dynamic visualizations" },
          { value: "advanced", label: "Advanced — real-time dashboards" },
          { value: "cutting_edge", label: "Cutting-edge — immersive analytics" },
        ]}
        value={getStringAnswer(answers["data_visualization"])}
        onChange={(val) => onAnswer("data_visualization", val)}
      />

      <MultipleChoiceQuestion
        question="How do you support decision-making?"
        options={[
          { value: "manual", label: "Manual — basic reporting" },
          { value: "assisted", label: "Assisted — data-driven insights" },
          { value: "automated", label: "Automated — predictive insights" },
          { value: "autonomous", label: "Autonomous — prescriptive actions" },
        ]}
        value={getStringAnswer(answers["decision_support"])}
        onChange={(val) => onAnswer("decision_support", val)}
      />
    </div>
  );
} 