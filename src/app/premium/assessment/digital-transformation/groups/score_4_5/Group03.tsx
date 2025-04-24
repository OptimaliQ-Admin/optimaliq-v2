"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_enablement"] === "string" &&
    typeof answers["digital_resilience"] === "string" &&
    typeof answers["cross_functional_alignment"] === "string"
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
        question="To what extent is AI or automation embedded into your digital operations?"
        options={[
          { value: "not_used", label: "Not at all — we haven’t explored it" },
          { value: "used_in_isolation", label: "Used in a few isolated processes" },
          { value: "integrated", label: "Integrated into multiple workflows" },
          { value: "core_capability", label: "It’s a core capability — built into strategy and delivery" },
        ]}
        value={getStringAnswer(answers["ai_enablement"])}
        onChange={(val) => onAnswer("ai_enablement", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How resilient is your digital infrastructure when faced with disruptions (e.g. outages, scale surges, vendor changes)?"
        options={[
          { value: "not_resilient", label: "Not resilient — any issue causes major problems" },
          { value: "somewhat_resilient", label: "Somewhat — we can adapt but it’s disruptive" },
          { value: "resilient", label: "Resilient — we have systems and redundancies in place" },
          { value: "highly_resilient", label: "Highly resilient — we handle disruptions with minimal impact" },
        ]}
        value={getStringAnswer(answers["digital_resilience"])}
        onChange={(val) => onAnswer("digital_resilience", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How aligned are different departments on digital strategy and priorities?"
        options={[
          { value: "not_aligned", label: "Not at all — everyone operates independently" },
          { value: "basic_alignment", label: "Some awareness, but not truly aligned" },
          { value: "mostly_aligned", label: "Mostly aligned — shared priorities exist" },
          { value: "fully_aligned", label: "Fully aligned — cross-functional goals and KPIs" },
        ]}
        value={getStringAnswer(answers["cross_functional_alignment"])}
        onChange={(val) => onAnswer("cross_functional_alignment", val)}
      />
    </div>
  );
}
