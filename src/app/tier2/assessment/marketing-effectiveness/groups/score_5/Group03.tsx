"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_usage"] === "string" &&
    typeof answers["marketing_innovation"] === "string" &&
    typeof answers["benchmarking"] === "string" &&
    typeof answers["next_priority"] === "string" &&
    answers["next_priority"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 7: ai_usage */}
      <MultipleChoiceQuestion
        question="To what extent is AI or machine learning integrated into your marketing execution?"
        options={[
          { value: "not_at_all", label: "Not at all" },
          { value: "used_occasionally", label: "Used occasionally (e.g., for subject lines or copy)" },
          { value: "embedded_some_areas", label: "Embedded into select areas like targeting or send time" },
          { value: "fully_automated", label: "Fully automated / optimized across channels" }
        ]}
        value={answers["ai_usage"] || ""}
        onChange={(val) => onAnswer("ai_usage", val)}
      />

      {/* Question 8: marketing_innovation */}
      <MultipleChoiceQuestion
        question="How often do you experiment with new marketing channels or techniques?"
        options={[
          { value: "rarely_test", label: "Rarely — we focus on what we know" },
          { value: "test_a_few", label: "We test a few things per quarter" },
          { value: "ongoing_testing", label: "We run ongoing experiments with clear KPIs" },
          { value: "innovation_culture", label: "Innovation is a core part of our marketing culture" }
        ]}
        value={answers["marketing_innovation"] || ""}
        onChange={(val) => onAnswer("marketing_innovation", val)}
      />

      {/* Question 9: benchmarking */}
      <MultipleChoiceQuestion
        question="How do you benchmark your marketing performance?"
        options={[
          { value: "no_benchmarking", label: "We don’t benchmark" },
          { value: "anecdotal_comparisons", label: "Anecdotal comparisons with peers" },
          { value: "internal_benchmarking", label: "Internal benchmarking against past performance" },
          { value: "industry_metrics", label: "Regular benchmarking using industry metrics" }
        ]}
        value={answers["benchmarking"] || ""}
        onChange={(val) => onAnswer("benchmarking", val)}
      />

      {/* Question 10: next_priority */}
      <TextAreaQuestion
        question="What’s the next big thing you want to accomplish in your marketing strategy?"
        placeholder="E.g., Integrate more AI, test new acquisition channels, improve nurture journeys..."
        value={answers["next_priority"] || ""}
        onChange={(val) => onAnswer("next_priority", val)}
        maxLength={300}
      />
    </div>
  );
}
