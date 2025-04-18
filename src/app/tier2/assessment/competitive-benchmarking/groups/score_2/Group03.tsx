"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmark_confidence"] === "string" &&
    typeof answers["kpi_alignment"] === "string" &&
    typeof answers["market_signal_integration"] === "string" &&
    typeof answers["benchmark_pain_point"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 7: benchmark_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy or relevance of your benchmarking data?"
        options={[
          { value: "not_confident", label: "Not confident — it’s outdated or unreliable" },
          { value: "somewhat_confident", label: "Somewhat — it’s directional at best" },
          { value: "mostly_confident", label: "Mostly — we trust it for planning" },
          { value: "very_confident", label: "Very — it’s consistently reliable" },
        ]}
        value={answers["benchmark_confidence"] || ""}
        onChange={(val) => onAnswer("benchmark_confidence", val)}
      />

      {/* Question 8: kpi_alignment */}
      <MultipleChoiceQuestion
        question="Do you align your internal KPIs with external benchmarks or industry averages?"
        options={[
          { value: "no_alignment", label: "No — we don’t benchmark KPIs" },
          { value: "loosely_aligned", label: "Loosely — we consider them but don’t act on them" },
          { value: "aligned_in_some_areas", label: "Yes — in a few areas like marketing or revenue" },
          { value: "broadly_aligned", label: "Yes — we align KPIs across departments" },
        ]}
        value={answers["kpi_alignment"] || ""}
        onChange={(val) => onAnswer("kpi_alignment", val)}
      />

      {/* Question 9: market_signal_integration */}
      <MultipleChoiceQuestion
        question="How do you respond to new competitive or market signals?"
        options={[
          { value: "reactive_only", label: "We react if it affects us directly" },
          { value: "sometimes_considered", label: "We sometimes consider signals in planning" },
          { value: "integrated_in_planning", label: "We incorporate market signals into strategy" },
          { value: "proactive_trendspotting", label: "We anticipate and act on market changes" },
        ]}
        value={answers["market_signal_integration"] || ""}
        onChange={(val) => onAnswer("market_signal_integration", val)}
      />

      {/* Question 10: benchmark_pain_point */}
      <TextAreaQuestion
        question="What’s the most frustrating or challenging part of benchmarking for your business today?"
        placeholder="E.g., lack of data, no process, hard to apply insights, etc."
        value={answers["benchmark_pain_point"] || ""}
        onChange={(val) => onAnswer("benchmark_pain_point", val)}
        maxLength={300}
      />
    </div>
  );
}
