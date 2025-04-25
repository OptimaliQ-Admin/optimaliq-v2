"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["feedback_frequency"] === "string" &&
    typeof answers["conflict_resolution"] === "string" &&
    typeof answers["leadership_visibility"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How often do team members receive feedback on performance?"
        options={[
          { value: "rarely", label: "Rarely or only during annual reviews" },
          { value: "quarterly", label: "Quarterly or semi-regularly" },
          { value: "monthly", label: "Monthly or during key projects" },
          { value: "continuous", label: "Continuously — part of our culture" },
        ]}
        value={getStringAnswer(answers["feedback_frequency"])}
        onChange={(val) => onAnswer("feedback_frequency", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How are conflicts or disagreements typically handled?"
        options={[
          { value: "ignored", label: "Often ignored or unresolved" },
          { value: "informal", label: "Handled informally, case-by-case" },
          { value: "structured", label: "Handled with structured discussions or mediation" },
          { value: "proactive", label: "Handled proactively with team norms and open dialogue" },
        ]}
        value={getStringAnswer(answers["conflict_resolution"])}
        onChange={(val) => onAnswer("conflict_resolution", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How visible and accessible is leadership to the broader team?"
        options={[
          { value: "invisible", label: "Not visible — rarely interact with team" },
          { value: "occasionally_visible", label: "Occasionally visible — only during meetings or crises" },
          { value: "frequently_visible", label: "Frequently visible — regular updates and touchpoints" },
          { value: "fully_accessible", label: "Fully accessible and actively engaged with teams" },
        ]}
        value={getStringAnswer(answers["leadership_visibility"])}
        onChange={(val) => onAnswer("leadership_visibility", val)}
      />
    </div>
  );
}
