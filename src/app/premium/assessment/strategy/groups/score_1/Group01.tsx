"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_focus"] === "string" &&
    typeof answers["planning_frequency"] === "string" &&
    typeof answers["vision_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="How would you describe your current strategic focus?"
        options={[
          { value: "reactive", label: "Mostly reactive, focusing on daily operations" },
          { value: "short_term_goals", label: "Some short-term goals, but limited long-term vision" },
          { value: "basic_plan", label: "Basic plan in place, but not consistently used" },
          { value: "clear_direction", label: "We have a clear direction and mission" },
        ]}
        value={getStringAnswer(answers["strategic_focus"])}
        onChange={(val) => onAnswer("strategic_focus", val)}
      />

      <MultipleChoiceQuestion
        question="How often does your team engage in formal strategic planning?"
        options={[
          { value: "never", label: "Never — we focus on immediate needs" },
          { value: "annually", label: "Annually, but not always followed" },
          { value: "semi_annually", label: "Semi-annually with some follow-through" },
          { value: "quarterly", label: "Quarterly or more, with consistent updates" },
        ]}
        value={getStringAnswer(answers["planning_frequency"])}
        onChange={(val) => onAnswer("planning_frequency", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned is your team around your company vision?"
        options={[
          { value: "no_alignment", label: "We don’t have a clearly stated vision" },
          { value: "somewhat", label: "There’s a general sense of direction" },
          { value: "mostly", label: "Most teams know the high-level strategy" },
          { value: "fully", label: "We’re all aligned and committed to the vision" },
        ]}
        value={getStringAnswer(answers["vision_alignment"])}
        onChange={(val) => onAnswer("vision_alignment", val)}
      />
    </div>
  );
}
