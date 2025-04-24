"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["decision_framework"] === "string" &&
    typeof answers["team_self_management"] === "string" &&
    typeof answers["visibility_into_progress"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="What kind of framework does leadership use for decision making?"
        options={[
          { value: "reactive", label: "Mostly reactive or urgent decisions" },
          { value: "ad_hoc", label: "Ad hoc discussions with little consistency" },
          { value: "criteria_based", label: "Uses some criteria or templates" },
          { value: "data_driven", label: "Data-driven with clear alignment to goals" },
        ]}
        value={getStringAnswer(answers["decision_framework"])}
        onChange={(val) => onAnswer("decision_framework", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How empowered is your team to manage their own work and make decisions?"
        options={[
          { value: "not_empowered", label: "Not at all — everything is top-down" },
          { value: "minor_autonomy", label: "Some autonomy within limits" },
          { value: "moderate_autonomy", label: "Moderately — teams manage most execution" },
          { value: "high_autonomy", label: "Highly — empowered to own outcomes" },
        ]}
        value={getStringAnswer(answers["team_self_management"])}
        onChange={(val) => onAnswer("team_self_management", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How visible is progress across initiatives or strategic goals?"
        options={[
          { value: "not_visible", label: "Not visible — hard to know where things stand" },
          { value: "occasional_checkins", label: "Occasionally discussed in meetings" },
          { value: "dashboard_view", label: "Some dashboards or reports" },
          { value: "real_time_transparency", label: "Clear, real-time transparency" },
        ]}
        value={getStringAnswer(answers["visibility_into_progress"])}
        onChange={(val) => onAnswer("visibility_into_progress", val)}
      />
    </div>
  );
}
