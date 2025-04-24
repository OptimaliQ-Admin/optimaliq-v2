"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["leadership_transparency"] === "string" &&
    typeof answers["team_autonomy"] === "string" &&
    typeof answers["decision_delegation"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: leadership_transparency */}
      <MultipleChoiceQuestion
        question="How transparent is leadership about company priorities and performance?"
        options={[
          { value: "limited", label: "Limited — shared on a need-to-know basis" },
          { value: "basic", label: "Basic — some updates in meetings" },
          { value: "regular", label: "Regular — we share dashboards and updates" },
          { value: "open", label: "Open — leadership shares wins, losses, and direction openly" },
        ]}
        value={answers["leadership_transparency"] || ""}
        onChange={(val) => onAnswer("leadership_transparency", val)}
      />

      {/* Question 2: team_autonomy */}
      <MultipleChoiceQuestion
        question="How much autonomy do teams have in setting and executing their own goals?"
        options={[
          { value: "low", label: "Low — leadership dictates most priorities" },
          { value: "some", label: "Some — teams get input but still need approvals" },
          { value: "moderate", label: "Moderate — teams set many of their own targets" },
          { value: "high", label: "High — teams operate with significant autonomy" },
        ]}
        value={answers["team_autonomy"] || ""}
        onChange={(val) => onAnswer("team_autonomy", val)}
      />

      {/* Question 3: decision_delegation */}
      <MultipleChoiceQuestion
        question="How are decisions typically delegated across your organization?"
        options={[
          { value: "centralized", label: "Mostly centralized — decisions stay at the top" },
          { value: "mixed", label: "Mixed — some delegation depending on function" },
          { value: "distributed", label: "Distributed — managers are expected to own decisions" },
          { value: "empowered", label: "Empowered — decision-making is a shared responsibility" },
        ]}
        value={answers["decision_delegation"] || ""}
        onChange={(val) => onAnswer("decision_delegation", val)}
      />
    </div>
  );
}
