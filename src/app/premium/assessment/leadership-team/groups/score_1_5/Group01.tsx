"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["leadership_structure"] === "string" &&
    typeof answers["manager_expectations"] === "string" &&
    typeof answers["feedback_frequency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How would you describe your current leadership structure?"
        options={[
          { value: "no_structure", label: "We don’t have a clear leadership structure" },
          { value: "loosely_defined", label: "It’s loosely defined — depends on the situation" },
          { value: "functional_leads", label: "We have leads by function but it’s not fully consistent" },
          { value: "clear_structure", label: "We have a clearly defined leadership structure" },
        ]}
        value={getStringAnswer(answers["leadership_structure"])}
        onChange={(val) => onAnswer("leadership_structure", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How clear are expectations for managers and team leads?"
        options={[
          { value: "not_clear", label: "They’re not clear — mostly learned on the job" },
          { value: "somewhat_clear", label: "Some expectations are documented" },
          { value: "mostly_clear", label: "They’re mostly documented and aligned" },
          { value: "very_clear", label: "Very clear with documented responsibilities and training" },
        ]}
        value={getStringAnswer(answers["manager_expectations"])}
        onChange={(val) => onAnswer("manager_expectations", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How frequently do team members receive feedback on performance?"
        options={[
          { value: "rarely", label: "Rarely — only when things go wrong" },
          { value: "occasionally", label: "Occasionally — at irregular intervals" },
          { value: "monthly", label: "Monthly or during project check-ins" },
          { value: "regularly", label: "Regularly — structured feedback is part of our process" },
        ]}
        value={getStringAnswer(answers["feedback_frequency"])}
        onChange={(val) => onAnswer("feedback_frequency", val)}
      />
    </div>
  );
}
