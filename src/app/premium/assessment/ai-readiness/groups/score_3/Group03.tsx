"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

// ✅ Validator function
export function isGroupComplete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["collaboration_model"] === "string" &&
    typeof answers["tool_initiatives"] === "string" &&
    typeof answers["success_definition"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: collaboration_model */}
      <MultipleChoiceQuestion
        question="What is your collaboration model between technical and business teams when implementing AI or automation?"
        options={[
          { value: "no_collaboration", label: "There is no collaboration or handoff" },
          { value: "basic_hand_off", label: "Basic hand-off from business to technical team" },
          { value: "collaborative", label: "Collaborative during planning and testing" },
          { value: "fully_integrated", label: "Fully integrated teams working together throughout" },
        ]}
        value={getStringAnswer(answers["collaboration_model"])}
        onChange={(val) => onAnswer("collaboration_model", val)}
      />

      {/* Question 9: tool_initiatives */}
      <MultipleChoiceQuestion
        question="How do new AI or automation tools typically get introduced in your organization?"
        options={[
          { value: "individual_initiative", label: "Individual experimentation or side projects" },
          { value: "team_specific", label: "Initiatives within specific teams" },
          { value: "pilot_then_expand", label: "We pilot new tools, then expand adoption" },
          { value: "strategic_evaluation", label: "Strategic evaluation with cross-team rollout" },
        ]}
        value={getStringAnswer(answers["tool_initiatives"])}
        onChange={(val) => onAnswer("tool_initiatives", val)}
      />

      {/* Question 10: success_definition */}
      <MultipleChoiceQuestion
        question="How do you define success when evaluating AI or automation efforts?"
        options={[
          { value: "gut_feel", label: "Gut feel or vague benefits" },
          { value: "efficiency_gain", label: "Improved speed or reduced effort" },
          { value: "measured_outcomes", label: "Measured outcomes tied to KPIs" },
          { value: "business_value", label: "Direct business impact (revenue, cost, satisfaction)" },
        ]}
        value={getStringAnswer(answers["success_definition"])}
        onChange={(val) => onAnswer("success_definition", val)}
      />
    </div>
  );
}
