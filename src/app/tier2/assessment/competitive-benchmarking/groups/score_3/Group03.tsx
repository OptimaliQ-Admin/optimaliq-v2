"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["market_signals"] === "string" &&
    typeof answers["competitor_gap_action"] === "string" &&
    typeof answers["benchmarking_impact"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: market_signals */}
      <MultipleChoiceQuestion
        question="How quickly do you respond to major market or competitive shifts?"
        options={[
          { value: "very_slowly", label: "Very slowly — we rarely change direction" },
          { value: "eventually", label: "Eventually — it takes months" },
          { value: "fairly_quickly", label: "Fairly quickly — within a few weeks" },
          { value: "rapidly", label: "Rapidly — we adjust priorities fast" },
        ]}
        value={answers["market_signals"] || ""}
        onChange={(val) => onAnswer("market_signals", val)}
      />

      {/* Question 9: competitor_gap_action */}
      <MultipleChoiceQuestion
        question="When you identify a gap vs. competitors, what happens next?"
        options={[
          { value: "nothing_changes", label: "Not much — it gets noted but nothing changes" },
          { value: "sometimes_discussed", label: "Sometimes discussed, but not acted on" },
          { value: "assigned_for_followup", label: "It’s assigned for follow-up or research" },
          { value: "feeds_into_strategy", label: "It directly feeds into planning and action" },
        ]}
        value={answers["competitor_gap_action"] || ""}
        onChange={(val) => onAnswer("competitor_gap_action", val)}
      />

      {/* Question 10: benchmarking_impact */}
      <MultipleChoiceQuestion
        question="How would you rate the impact of competitive benchmarking in your business?"
        options={[
          { value: "little_or_no", label: "Little or no impact" },
          { value: "some_guidance", label: "It gives us some useful guidance" },
          { value: "shapes_strategy", label: "It shapes part of our strategy" },
          { value: "drives_major_initiatives", label: "It drives major initiatives and change" },
        ]}
        value={answers["benchmarking_impact"] || ""}
        onChange={(val) => onAnswer("benchmarking_impact", val)}
      />
    </div>
  );
}
