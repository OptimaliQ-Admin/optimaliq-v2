"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isGroup08Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["business_overview"] === "string" &&
    answers["business_overview"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group08_BusinessOverview({ answers, onAnswer }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      {/* Business Overview Question */}
      <TextAreaQuestion
        question="Briefly describe what your business offers, who you serve, and how you deliver value."
        description="This helps us personalize insights and recommendations that make sense for your model."
        placeholder="Example: We provide SaaS project management software for small to medium-sized marketing agencies. Our platform helps teams collaborate on client projects, track time, and deliver results on time and budget."
        value={getStringAnswer(answers["business_overview"])}
        onChange={(val) => onAnswer("business_overview", val)}
        maxLength={500}
      />
    </div>
  );
} 