"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_1d7838"] === "string" &&
    typeof answers["what's_6ec1f3"] === "string" &&
    typeof answers["how_de0081"] === "string" &&
    typeof answers["what_3164b1"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
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
        value={getStringAnswer(answers["how_1d7838"])}
        onChange={(val) => onAnswer("how_1d7838", val)}
      />

      {/* Question 9: what's_6ec1f3 */}
      <TextAreaQuestion
        question="What's one part of your pipeline that's working really well — and why?"
        placeholder="E.g., discovery process, win rate, closing discipline"
        value={getStringAnswer(answers["what's_6ec1f3"])}
        onChange={(val) => onAnswer("what's_6ec1f3", val)}
        maxLength={300}
      />

      {/* Question 10: how_de0081 */}
      <MultipleChoiceQuestion
        question="How prepared is your team to scale sales across new regions, verticals, or segments?"
        options={[
          { value: "not_ready", label: "Not ready — we're still refining" },
          { value: "somewhat_ready", label: "Somewhat — we're experimenting" },
          { value: "mostly_ready", label: "Mostly — we've proven repeatability" },
          { value: "very_ready", label: "Very ready — we have repeatable systems and resourcing" },
        ]}
        value={getStringAnswer(answers["how_de0081"])}
        onChange={(val) => onAnswer("how_de0081", val)}
      />

      {/* Question 11: what_3164b1 */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold">
          What&apos;s the biggest obstacle you face when trying to close more deals?
        </Label>
        <Textarea
          placeholder="E.g., high CAC, unclear process, lead quality"
          value={getStringAnswer(answers["what_3164b1"])}
          onChange={(e) => onAnswer("what_3164b1", e.target.value)}
          maxLength={300}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
