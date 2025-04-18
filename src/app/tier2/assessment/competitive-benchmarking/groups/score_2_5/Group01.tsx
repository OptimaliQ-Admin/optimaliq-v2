"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["market_awareness"] === "string" &&
    typeof answers["industry_position"] === "string" &&
    typeof answers["competitive_intel_sources"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: market_awareness */}
      <MultipleChoiceQuestion
        question="How aware are you of trends and shifts happening in your industry or market?"
        options={[
          { value: "not_aware", label: "Not very aware" },
          { value: "somewhat_aware", label: "Somewhat aware — we hear things occasionally" },
          { value: "regular_updates", label: "We get regular updates or newsletters" },
          { value: "actively_monitor", label: "We actively monitor and analyze trends" },
        ]}
        value={answers["market_awareness"] || ""}
        onChange={(val) => onAnswer("market_awareness", val)}
      />

      {/* Question 2: industry_position */}
      <MultipleChoiceQuestion
        question="How well do you understand your company’s position in the competitive landscape?"
        options={[
          { value: "no_idea", label: "We’re not really sure where we stand" },
          { value: "broad_idea", label: "We have a broad idea, but nothing detailed" },
          { value: "some_data", label: "We have some competitive data" },
          { value: "clear_benchmarking", label: "We have clear benchmarks and competitive insights" },
        ]}
        value={answers["industry_position"] || ""}
        onChange={(val) => onAnswer("industry_position", val)}
      />

      {/* Question 3: competitive_intel_sources */}
      <MultipleChoiceQuestion
        question="What are your primary sources of competitive intelligence?"
        options={[
          { value: "word_of_mouth", label: "Mostly word of mouth or social media" },
          { value: "internal_notes", label: "We occasionally take notes from sales or marketing" },
          { value: "news_and_reports", label: "Industry news, analyst reports, or earnings calls" },
          { value: "dedicated_sources", label: "We use dedicated research platforms or tools" },
        ]}
        value={answers["competitive_intel_sources"] || ""}
        onChange={(val) => onAnswer("competitive_intel_sources", val)}
      />
    </div>
  );
}
