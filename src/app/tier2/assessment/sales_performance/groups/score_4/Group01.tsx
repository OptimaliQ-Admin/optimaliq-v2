"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_4Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["forecast_usage"] === "string" &&
    answers["forecast_usage"].trim().length > 0 &&
    typeof answers["process_adoption"] === "string" &&
    answers["process_adoption"].trim().length > 0 &&
    Array.isArray(answers["automated_steps"]) &&
    answers["automated_steps"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  const automation = answers["automated_steps"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: forecast_usage */}
      <MultipleChoiceQuestion
        question="How are your sales forecasts used beyond the sales org?"
        options={[
          { value: "not_used", label: "They aren’t really used outside sales" },
          { value: "exec_only", label: "They’re reviewed by execs but not used operationally" },
          { value: "used_for_planning", label: "They’re used in capacity and resource planning" },
          { value: "core_driver", label: "They’re a core input to company-level planning" },
        ]}
        value={answers["forecast_usage"] || ""}
        onChange={(val) => onAnswer("forecast_usage", val)}
      />

      {/* Question 2: process_adoption */}
      <MultipleChoiceQuestion
        question="How do you ensure consistent adoption of your sales process?"
        options={[
          { value: "manager_reinforced", label: "We rely on managers to reinforce it" },
          { value: "monitored", label: "We provide training and monitor usage" },
          { value: "measured", label: "We track adoption and coach accordingly" },
          { value: "embedded_systems", label: "It’s embedded into systems and workflows" },
        ]}
        value={answers["process_adoption"] || ""}
        onChange={(val) => onAnswer("process_adoption", val)}
      />

      {/* Question 3: automated_steps */}
      <MultiSelectQuestion
        question="Which of the following are automated or streamlined in your sales process?"
        options={[
          { value: "lead_routing", label: "Lead routing" },
          { value: "followups", label: "Follow-up sequences" },
          { value: "proposal_generation", label: "Proposal generation" },
          { value: "renewal_triggers", label: "Renewal or expansion triggers" },
          { value: "none", label: "None of these" },
        ]}
        selected={automation}
        onChange={(val) => onAnswer("automated_steps", val)}
        maxSelect={5}
      />
    </div>
  );
}
