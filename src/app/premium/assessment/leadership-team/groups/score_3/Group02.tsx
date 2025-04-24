"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cross_team_collaboration"] === "string" &&
    typeof answers["leadership_alignment"] === "string" &&
    typeof answers["team_accountability"] === "string" &&
    typeof answers["manager_1on1s"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How well do teams collaborate across departments?"
        options={[
          { value: "siloed", label: "Rarely — teams work in silos" },
          { value: "ad_hoc", label: "Ad hoc collaboration when needed" },
          { value: "some_structure", label: "Some structured collaboration and updates" },
          { value: "high_alignment", label: "Strong alignment with shared priorities" },
        ]}
        value={getStringAnswer(answers["cross_team_collaboration"])}
        onChange={(val) => onAnswer("cross_team_collaboration", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How aligned is your leadership team on goals and priorities?"
        options={[
          { value: "not_aligned", label: "Not very — people pull in different directions" },
          { value: "basic_alignment", label: "Basic alignment but some conflict" },
          { value: "mostly_aligned", label: "Mostly aligned with occasional gaps" },
          { value: "fully_aligned", label: "Fully aligned — decisions and messaging are unified" },
        ]}
        value={getStringAnswer(answers["leadership_alignment"])}
        onChange={(val) => onAnswer("leadership_alignment", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How clear is team accountability when issues arise?"
        options={[
          { value: "unclear", label: "Unclear — no clear owner" },
          { value: "blame_culture", label: "Blame culture — finger pointing" },
          { value: "some_structure", label: "Some structure for follow-up" },
          { value: "clear_ownership", label: "Clear ownership and resolution processes" },
        ]}
        value={getStringAnswer(answers["team_accountability"])}
        onChange={(val) => onAnswer("team_accountability", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How often do managers hold 1:1s focused on coaching or development?"
        options={[
          { value: "rarely", label: "Rarely or never" },
          { value: "occasionally", label: "Occasionally — mostly status updates" },
          { value: "monthly", label: "At least monthly with some structure" },
          { value: "weekly_development", label: "Weekly or structured around growth" },
        ]}
        value={getStringAnswer(answers["manager_1on1s"])}
        onChange={(val) => onAnswer("manager_1on1s", val)}
      />
    </div>
  );
}
