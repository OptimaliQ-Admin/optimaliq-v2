"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ab_testing"] === "string" &&
    typeof answers["conversion_monitoring"] === "string" &&
    typeof answers["campaign_feedback"] === "string" &&
    typeof answers["reporting_confidence"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: ab_testing */}
      <MultipleChoiceQuestion
        question="Do you run A/B tests on marketing content (emails, ads, pages)?"
        options={[
          { value: "no_testing", label: "We don’t run tests" },
          { value: "occasional_testing", label: "Occasionally — a few per year" },
          { value: "frequent_testing", label: "Yes — we test monthly or more" },
          { value: "automated_testing", label: "Yes — we have automated testing frameworks" },
        ]}
        value={getStringAnswer(answers["ab_testing"])}
        onChange={(val) => onAnswer("ab_testing", val)}
      />

      {/* Question 5: conversion_monitoring */}
      <MultipleChoiceQuestion
        question="How do you monitor key conversion metrics?"
        options={[
          { value: "not_monitored", label: "We don’t monitor them consistently" },
          { value: "basic_reports", label: "We check performance in Google Analytics or platforms" },
          { value: "dashboard_review", label: "We review dashboards and KPIs regularly" },
          { value: "alert_triggers", label: "We have alerts or automated reporting when metrics drop" },
        ]}
        value={getStringAnswer(answers["conversion_monitoring"])}
        onChange={(val) => onAnswer("conversion_monitoring", val)}
      />

      {/* Question 6: campaign_feedback */}
      <MultipleChoiceQuestion
        question="How do you gather feedback on the effectiveness of your marketing campaigns?"
        options={[
          { value: "no_feedback", label: "We don’t collect feedback" },
          { value: "internal_feedback", label: "Internal team feedback" },
          { value: "occasional_surveys", label: "We occasionally survey or review with stakeholders" },
          { value: "structured_review", label: "We do structured campaign debriefs or retrospectives" },
        ]}
        value={getStringAnswer(answers["campaign_feedback"])}
        onChange={(val) => onAnswer("campaign_feedback", val)}
      />

      {/* Question 7: reporting_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in your current marketing reporting?"
        options={[
          { value: "not_confident", label: "Not confident — it’s often unclear or inaccurate" },
          { value: "somewhat_confident", label: "Somewhat confident, but not always actionable" },
          { value: "mostly_confident", label: "Mostly confident — we get reliable insights" },
          { value: "very_confident", label: "Very confident — reporting drives decisions" },
        ]}
        value={getStringAnswer(answers["reporting_confidence"])}
        onChange={(val) => onAnswer("reporting_confidence", val)}
      />
    </div>
  );
}
