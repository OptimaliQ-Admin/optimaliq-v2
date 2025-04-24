"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["alignment_with_mission"] === "string" &&
    typeof answers["adaptive_decision_making"] === "string" &&
    typeof answers["strategic_maturity_confidence"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How well is your strategy aligned with your company’s mission and values?"
        options={[
          { value: "no_alignment", label: "Not at all — they feel disconnected" },
          { value: "partial_alignment", label: "Partially — we reference them occasionally" },
          { value: "strong_alignment", label: "Strong — they guide our priorities" },
          { value: "full_alignment", label: "Fully — mission and values shape all key decisions" },
        ]}
        value={getStringAnswer(answers["alignment_with_mission"])}
        onChange={(val) => onAnswer("alignment_with_mission", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="When things change, how quickly does your strategy adapt?"
        options={[
          { value: "very_slow", label: "Very slowly — we stick to the plan" },
          { value: "somewhat_slow", label: "Somewhat slowly — change requires big approvals" },
          { value: "moderate", label: "Moderately — we respond with agility when needed" },
          { value: "proactive", label: "Very quickly — our strategy is designed to evolve" },
        ]}
        value={getStringAnswer(answers["adaptive_decision_making"])}
        onChange={(val) => onAnswer("adaptive_decision_making", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How confident are you in your organization’s strategic maturity?"
        options={[
          { value: "not_confident", label: "Not confident — we’re still figuring things out" },
          { value: "somewhat_confident", label: "Somewhat confident — we’ve made progress" },
          { value: "mostly_confident", label: "Mostly confident — we have strong fundamentals" },
          { value: "fully_confident", label: "Fully confident — we’re a strategic leader" },
        ]}
        value={getStringAnswer(answers["strategic_maturity_confidence"])}
        onChange={(val) => onAnswer("strategic_maturity_confidence", val)}
      />
    </div>
  );
}
