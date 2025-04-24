"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_communication"] === "string" &&
    typeof answers["initiative_tracking"] === "string" &&
    typeof answers["agility_to_shift"] === "string" &&
    typeof answers["kpi_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: strategic_communication */}
      <MultipleChoiceQuestion
        question="How clearly is the company strategy communicated to teams?"
        options={[
          { value: "not_communicated", label: "It’s not communicated at all" },
          { value: "shared_once", label: "It was shared during an all-hands or email" },
          { value: "mentioned_regularly", label: "It’s mentioned in meetings or updates" },
          { value: "deeply_embedded", label: "It’s deeply embedded in team workflows" },
        ]}
        value={getStringAnswer(answers["strategic_communication"])}
        onChange={(val) => onAnswer("strategic_communication", val)}
      />

      {/* Question 5: initiative_tracking */}
      <MultipleChoiceQuestion
        question="How do you track progress against strategic initiatives?"
        options={[
          { value: "not_tracked", label: "We don’t really track progress" },
          { value: "informal_checkins", label: "We do informal check-ins occasionally" },
          { value: "team_reports", label: "Teams report progress manually" },
          { value: "real_time_tracking", label: "We have dashboards or OKRs in real time" },
        ]}
        value={getStringAnswer(answers["initiative_tracking"])}
        onChange={(val) => onAnswer("initiative_tracking", val)}
      />

      {/* Question 6: agility_to_shift */}
      <MultipleChoiceQuestion
        question="How quickly can you shift strategy based on market or customer changes?"
        options={[
          { value: "not_flexible", label: "We’re not flexible — changes are slow" },
          { value: "somewhat_flexible", label: "We adjust every few months" },
          { value: "agile", label: "We adapt monthly or quarterly" },
          { value: "highly_agile", label: "We pivot quickly as needed with minimal disruption" },
        ]}
        value={getStringAnswer(answers["agility_to_shift"])}
        onChange={(val) => onAnswer("agility_to_shift", val)}
      />

      {/* Question 7: kpi_alignment */}
      <MultipleChoiceQuestion
        question="To what extent are KPIs tied to strategic outcomes?"
        options={[
          { value: "not_tied", label: "They’re not tied at all" },
          { value: "somewhat_tied", label: "Some departments are aligned" },
          { value: "mostly_tied", label: "Most KPIs map to strategic goals" },
          { value: "fully_tied", label: "KPIs are fully aligned and tracked" },
        ]}
        value={getStringAnswer(answers["kpi_alignment"])}
        onChange={(val) => onAnswer("kpi_alignment", val)}
      />
    </div>
  );
}
