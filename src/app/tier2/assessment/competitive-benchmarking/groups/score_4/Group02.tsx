"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["market_position_awareness"] === "string" &&
    typeof answers["customer_expectation_tracking"] === "string" &&
    typeof answers["benchmark_kpis"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: market_position_awareness */}
      <MultipleChoiceQuestion
        question="How aware are you of where your business stands relative to the competition?"
        options={[
          { value: "no_awareness", label: "We have no real visibility into this" },
          { value: "some_awareness", label: "We make assumptions or rely on anecdotes" },
          { value: "data_based", label: "We track competitor positioning with data" },
          { value: "confident_and_clear", label: "We’re very confident in our market position" },
        ]}
        value={answers["market_position_awareness"] || ""}
        onChange={(val) => onAnswer("market_position_awareness", val)}
      />

      {/* Question 5: customer_expectation_tracking */}
      <MultipleChoiceQuestion
        question="How do you keep up with changing customer expectations?"
        options={[
          { value: "we_dont", label: "We don’t — we guess or react after the fact" },
          { value: "occasional_research", label: "Occasional research or surveys" },
          { value: "regular_feedback_loops", label: "We have regular feedback loops in place" },
          { value: "proactive_analytics", label: "We use data, feedback, and trends to anticipate changes" },
        ]}
        value={answers["customer_expectation_tracking"] || ""}
        onChange={(val) => onAnswer("customer_expectation_tracking", val)}
      />

      {/* Question 6: benchmark_kpis */}
      <MultipleChoiceQuestion
        question="Do you benchmark your KPIs against others in your space?"
        options={[
          { value: "no", label: "No — we don’t have external benchmarks" },
          { value: "limited", label: "Limited — we look at public data sometimes" },
          { value: "some_context", label: "Some context from partners or advisors" },
          { value: "ongoing_benchmarking", label: "Yes — we benchmark as part of our reporting rhythm" },
        ]}
        value={answers["benchmark_kpis"] || ""}
        onChange={(val) => onAnswer("benchmark_kpis", val)}
      />
    </div>
  );
}
