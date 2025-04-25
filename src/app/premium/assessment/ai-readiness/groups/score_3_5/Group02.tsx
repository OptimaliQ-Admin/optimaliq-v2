"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_team_integration"] === "string" &&
    typeof answers["ai_model_monitoring"] === "string" &&
    typeof answers["ai_bias_mitigation"] === "string" &&
    typeof answers["ai_training_uptake"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_team_integration */}
      <MultipleChoiceQuestion
        question="How integrated are your AI specialists or teams with other departments?"
        options={[
          { value: "not_involved", label: "They work in isolation" },
          { value: "project_based", label: "They’re involved on a project-by-project basis" },
          { value: "embedded_teams", label: "They are embedded in major workflows or teams" },
          { value: "fully_integrated", label: "Fully integrated into day-to-day decision-making" },
        ]}
        value={getStringAnswer(answers["ai_team_integration"])}
        onChange={(val) => onAnswer("ai_team_integration", val)}
      />

      {/* Question 5: ai_model_monitoring */}
      <MultipleChoiceQuestion
        question="How do you monitor the accuracy and performance of AI models in production?"
        options={[
          { value: "we_dont", label: "We don’t — it’s set and forget" },
          { value: "manual_checkins", label: "Occasional manual check-ins or tests" },
          { value: "active_monitoring", label: "Active monitoring by a data/engineering team" },
          { value: "automated_and_alerted", label: "Automated with alerts and retraining logic" },
        ]}
        value={getStringAnswer(answers["ai_model_monitoring"])}
        onChange={(val) => onAnswer("ai_model_monitoring", val)}
      />

      {/* Question 6: ai_bias_mitigation */}
      <MultipleChoiceQuestion
        question="How do you manage risk around AI bias and fairness?"
        options={[
          { value: "no_policies", label: "No active mitigation or review" },
          { value: "informal_checks", label: "Some informal spot-checking" },
          { value: "bias_audit_process", label: "We follow a defined audit process" },
          { value: "ethics_framework", label: "We have ethics frameworks and governance in place" },
        ]}
        value={getStringAnswer(answers["ai_bias_mitigation"])}
        onChange={(val) => onAnswer("ai_bias_mitigation", val)}
      />

      {/* Question 7: ai_training_uptake */}
      <MultipleChoiceQuestion
        question="How widespread is AI-related training or upskilling across your teams?"
        options={[
          { value: "no_training", label: "No training has been provided" },
          { value: "some_opt_in", label: "Some employees can opt into basic training" },
          { value: "team_level_focus", label: "Targeted training for certain roles or teams" },
          { value: "org_wide_initiative", label: "Company-wide initiative with goals and tracking" },
        ]}
        value={getStringAnswer(answers["ai_training_uptake"])}
        onChange={(val) => onAnswer("ai_training_uptake", val)}
      />
    </div>
  );
}
