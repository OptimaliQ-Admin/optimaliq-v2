"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_1e24f7"] === "string" &&
    answers["how_1e24f7"].trim().length > 0 &&
    typeof answers["whats_59e9f8"] === "string" &&
    answers["whats_59e9f8"].trim().length > 0 &&
    typeof answers["whats_840187"] === "string" &&
    answers["whats_840187"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_1e24f7 */}
      <MultipleChoiceQuestion
        question="How effective is your current handoff process from marketing or SDR to sales?"
        options={[
          { value: "no_handoff", label: "We don’t really have a handoff" },
          { value: "inconsistent", label: "It’s inconsistent" },
          { value: "mostly_smooth", label: "It’s mostly smooth, but has gaps" },
          { value: "standardized", label: "It’s standardized and clearly defined" },
        ]}
        value={getStringAnswer(answers["how_1e24f7"])}
        onChange={(val) => onAnswer("how_1e24f7", val)}
      />

      {/* Question 9: whats_59e9f8 */}
      <TextAreaQuestion
        question="What’s the biggest friction point in your current sales cycle?"
        placeholder="E.g., qualification, follow-ups, deal progression"
        value={getStringAnswer(answers["whats_59e9f8"])}
        onChange={(val) => onAnswer("whats_59e9f8", val)}
        maxLength={300}
      />

      {/* Question 10: whats_840187 */}
      <TextAreaQuestion
        question="What’s one improvement you’d make to your sales process if you could implement it today?"
        placeholder="E.g., automation, coaching, process clarity"
        value={getStringAnswer(answers["whats_840187"])}
        onChange={(val) => onAnswer("whats_840187", val)}
        maxLength={300}
      />
    </div>
  );
}
