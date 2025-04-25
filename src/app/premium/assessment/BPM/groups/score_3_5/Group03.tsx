"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["adoption"] === "string" &&
    answers["adoption"].trim().length > 0 &&

    typeof answers["automation"] === "string" &&
    answers["automation"].trim().length > 0 &&

    Array.isArray(answers["monitoring"]) &&
    answers["monitoring"].length > 0 &&

    typeof answers["ownership_model"] === "string" &&
    answers["ownership_model"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  const monitoring = answers["monitoring"] || [];

  return (
    <div className="space-y-10">

      {/* Question 7: adoption */}
      <MultipleChoiceQuestion
        question="How confident are you that process updates are adopted and followed across all teams?"
        options={[
          { value: "Not confident", label: "Not confident" },
          { value: "Somewhat", label: "Somewhat confident" },
          { value: "Mostly", label: "Mostly confident" },
          { value: "Fully confident", label: "Fully confident with audit trails" },
        ]}
        value={getStringAnswer(answers["adoption"])}
        onChange={(val) => onAnswer("adoption", val)}
      />


      {/* Question 8: automation */}
      <MultipleChoiceQuestion
        question="Do you have any automation in place for repetitive tasks (e.g. approvals, notifications, data syncs)?"
        options={[
          { value: "No automation", label: "No automation" },
          { value: "few isolated automations", label: "A few isolated automations" },
          { value: "Widespread use in certain teams", label: "Widespread use in certain teams" },
          { value: "Automation is deeply embedded across functions", label: "Automation is deeply embedded across functions" },
        ]}
        value={getStringAnswer(answers["automation"])}
        onChange={(val) => onAnswer("automation", val)}
      />

      {/* Question 9: monitoring */}
      <MultiSelectQuestion
        question="What methods do you use to monitor the health of critical workflows?"
        options={[
          { value: "Spreadsheets", label: "Dashboards or reports" },
          { value: "Project boards", label: "Workflow audit logs" },
          { value: "chat tools", label: "Manual check-ins" },
          { value: "Email", label: "Team feedback" },
          { value: "workflow software", label: "We don’t currently monitor health" },
        ]}
        selected={Array.isArray(getArrayAnswer(monitoring)) ? getArrayAnswer(monitoring) : []}
              onChange={(val) => onAnswer("monitoring", val)}
              maxSelect={5}
            />


      {/* Question 10: ownership_model */}
      <MultipleChoiceQuestion
        question="Which team or role is ultimately responsible for improving process efficiency across your organization?"
        options={[
          { value: "No one", label: "No one — it’s decentralized" },
          { value: "Functional managers own their teams' processes", label: "Functional managers own their teams' processes" },
          { value: "centralized ops or enablement function", label: "A centralized ops or enablement function" },
          { value: "dedicated BPM, RevOps, or process team", label: "A dedicated BPM, RevOps, or process team" },
        ]}
        value={getStringAnswer(answers["ownership_model"])}
        onChange={(val) => onAnswer("ownership_model", val)}
      />

    </div>
  );
}
