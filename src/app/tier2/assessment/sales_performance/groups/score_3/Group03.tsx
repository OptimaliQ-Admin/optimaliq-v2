"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["how_1d7838"] === "string" &&
    typeof answers["what’s_6ec1f3"] === "string" &&
    typeof answers["how_de0081"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_1d7838 */}
      <MultipleChoiceQuestion
        question="How aligned is your sales process with marketing or lead generation efforts?"
        options={[
          { value: "not_aligned", label: "Not aligned — we operate independently" },
          { value: "some_alignment", label: "Some alignment in handoff or messaging" },
          { value: "shared_goals", label: "Shared goals and meeting cadence" },
          { value: "fully_integrated", label: "Fully integrated strategy and performance tracking" },
        ]}
        value={answers["how_1d7838"] || ""}
        onChange={(val) => onAnswer("how_1d7838", val)}
      />

      {/* Question 9: what’s_6ec1f3 */}
      <TextAreaQuestion
        question="What’s one part of your pipeline that’s working really well — and why?"
        placeholder="E.g., discovery process, win rate, closing discipline"
        value={answers["what’s_6ec1f3"] || ""}
        onChange={(val) => onAnswer("what’s_6ec1f3", val)}
        maxLength={300}
      />

      {/* Question 10: how_de0081 */}
      <MultipleChoiceQuestion
        question="How prepared is your team to scale sales across new regions, verticals, or segments?"
        options={[
          { value: "not_ready", label: "Not ready — we’re still refining" },
          { value: "somewhat_ready", label: "Somewhat — we’re experimenting" },
          { value: "mostly_ready", label: "Mostly — we’ve proven repeatability" },
          { value: "very_ready", label: "Very ready — we have repeatable systems and resourcing" },
        ]}
        value={answers["how_de0081"] || ""}
        onChange={(val) => onAnswer("how_de0081", val)}
      />
    </div>
  );
}
