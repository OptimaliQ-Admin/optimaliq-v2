"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_governance"] === "string" &&
    typeof answers["ai_change_management"] === "string" &&
    typeof answers["ai_bias_awareness"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_governance */}
      <MultipleChoiceQuestion
        question="Do you have an AI governance framework in place?"
        options={[
          { value: "no_framework", label: "No — we haven’t defined one yet" },
          { value: "basic_guidelines", label: "Basic guidelines for some AI use" },
          { value: "formal_review", label: "Formal review and approval process" },
          { value: "comprehensive_framework", label: "Comprehensive, org-wide governance framework" },
        ]}
        value={answers["ai_governance"]
