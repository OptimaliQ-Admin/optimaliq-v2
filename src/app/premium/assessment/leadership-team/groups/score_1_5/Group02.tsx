"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["team_alignment"] === "string" &&
    typeof answers["role_clarity"] === "string" &&
    typeof answers["collaboration_frequency"] === "string" &&
    typeof answers["decision_making"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How aligned is your team on overall company goals?"
        options={[
          { value: "not_aligned", label: "Not aligned — everyone is doing their own thing" },
          { value: "somewhat_aligned", label: "Some alignment, but not always clear" },
          { value: "mostly_aligned", label: "Mostly aligned with occasional gaps" },
          { value: "fully_aligned", label: "Fully aligned and regularly updated" },
        ]}
        value={getStringAnswer(answers["team_alignment"])}
        onChange={(val) => onAnswer("team_alignment", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How clear are roles and responsibilities on your team?"
        options={[
          { value: "not_clear", label: "Not clear — it changes based on the project" },
          { value: "loosely_defined", label: "Loosely defined with some overlaps" },
          { value: "mostly_clear", label: "Mostly clear with a few gray areas" },
          { value: "very_clear", label: "Very clear and documented" },
        ]}
        value={getStringAnswer(answers["role_clarity"])}
        onChange={(val) => onAnswer("role_clarity", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How often do teams collaborate across departments or functions?"
        options={[
          { value: "rarely", label: "Rarely — mostly siloed work" },
          { value: "sometimes", label: "Sometimes — mostly during big projects" },
          { value: "frequently", label: "Frequently — collaboration is encouraged" },
          { value: "always", label: "Always — cross-functional collaboration is the norm" },
        ]}
        value={getStringAnswer(answers["collaboration_frequency"])}
        onChange={(val) => onAnswer("collaboration_frequency", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How are important decisions typically made?"
        options={[
          { value: "top_down", label: "Top-down — leadership makes most decisions" },
          { value: "mixed", label: "Mixed — leadership guides, team contributes" },
          { value: "collaborative", label: "Collaborative — decisions are discussed openly" },
          { value: "empowered", label: "Empowered — teams have decision-making autonomy" },
        ]}
        value={getStringAnswer(answers["decision_making"])}
        onChange={(val) => onAnswer("decision_making", val)}
      />
    </div>
  );
}
