"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_metrics_tracked"] === "string" &&
    typeof answers["personalization_level"] === "string" &&
    typeof answers["cx_insight_sharing"] === "string" &&
    typeof answers["cx_accountability"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="What types of customer experience (CX) metrics do you track?"
        options={[
          { value: "none", label: "None or anecdotal only" },
          { value: "basic_metrics", label: "NPS, CSAT, or similar basic scores" },
          { value: "cx_with_behavioral", label: "CX scores with behavioral/transaction data" },
          { value: "full_funnel", label: "Full-funnel metrics tied to CX and business outcomes" },
        ]}
        value={answers["cx_metrics_tracked"] || ""}
        onChange={(val) => onAnswer("cx_metrics_tracked", val)}
      />

      <MultipleChoiceQuestion
        question="How personalized is your customer experience today?"
        options={[
          { value: "generic", label: "Generic for all customers" },
          { value: "some_segmentation", label: "Some segmentation (e.g. personas, lifecycle)" },
          { value: "real_time_personalization", label: "Real-time personalization on channels" },
          { value: "omnichannel_ai", label: "Omnichannel, AI-driven personalization" },
        ]}
        value={answers["personalization_level"] || ""}
        onChange={(val) => onAnswer("personalization_level", val)}
      />

      <MultipleChoiceQuestion
        question="How are customer insights shared across your company?"
        options={[
          { value: "not_shared", label: "Not formally shared" },
          { value: "shared_in_meetings", label: "
