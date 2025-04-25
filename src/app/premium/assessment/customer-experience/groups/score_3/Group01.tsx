"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["insight_sharing"] === "string" &&
    typeof answers["feedback_loop"] === "string" &&
    typeof answers["team_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      <MultipleChoiceQuestion
        question="How often do customer insights get shared across departments?"
        options={[
          { value: "rarely_shared", label: "Rarely — insights stay siloed" },
          { value: "sometimes_shared", label: "Sometimes shared informally" },
          { value: "frequently_shared", label: "Frequently shared with key teams" },
          { value: "fully_integrated", label: "Fully integrated into team workflows" },
        ]}
        value={getStringAnswer(answers["insight_sharing"])}
        onChange={(val) => onAnswer("insight_sharing", val)}
      />

      <MultipleChoiceQuestion
        question="What kind of feedback loop do you have with customers?"
        options={[
          { value: "none", label: "None — we don’t ask regularly" },
          { value: "ad_hoc", label: "Ad hoc — occasional surveys or outreach" },
          { value: "structured", label: "Structured — regular reviews and analysis" },
          { value: "strategic", label: "Strategic — insights shape priorities" },
        ]}
        value={getStringAnswer(answers["feedback_loop"])}
        onChange={(val) => onAnswer("feedback_loop", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned is your team around the customer experience?"
        options={[
          { value: "not_aligned", label: "Not aligned — everyone has their own view" },
          { value: "somewhat_aligned", label: "Somewhat aligned — we agree on basics" },
          { value: "mostly_aligned", label: "Mostly aligned — shared goals and priorities" },
          { value: "fully_aligned", label: "Fully aligned — strong CX culture" },
        ]}
        value={getStringAnswer(answers["team_alignment"])}
        onChange={(val) => onAnswer("team_alignment", val)}
      />
    </div>
  );
}
