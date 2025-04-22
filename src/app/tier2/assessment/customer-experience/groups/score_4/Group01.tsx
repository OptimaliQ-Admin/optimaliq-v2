"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_strategic_initiatives"] === "string" &&
    typeof answers["cx_personalization_maturity"] === "string" &&
    typeof answers["cx_metrics_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="What role does CX play in your strategic initiatives?"
        options={[
          { value: "cx_not_considered", label: "CX isn’t typically considered strategically" },
          { value: "cx_mentioned", label: "CX is mentioned, but not prioritized" },
          { value: "cx_initiatives_included", label: "CX initiatives are included in planning" },
          { value: "cx_strategic_driver", label: "CX is a core driver of strategy and investment" },
        ]}
        value={answers["cx_strategic_initiatives"] || ""}
        onChange={(val) => onAnswer("cx_strategic_initiatives", val)}
      />

      <MultipleChoiceQuestion
        question="How mature is your personalization strategy across channels?"
        options={[
          { value: "minimal", label: "Minimal — mostly one-size-fits-all messaging" },
          { value: "basic", label: "Basic — we segment and tailor occasionally" },
          { value: "coordinated", label: "Coordinated — we personalize by journey stage" },
          { value: "dynamic", label: "Dynamic — personalization adapts in real time" },
        ]}
        value={answers["cx_personalization_maturity"] || ""}
        onChange={(val) => onAnswer("cx_personalization_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned are your CX and business performance metrics?"
        options={[
          { value: "not_tracked", label: "We don’t track CX metrics" },
          { value: "loosely_tracked", label: "They’re tracked but not connected to performance" },
          { value: "linked_to_kpis", label: "They’re linked to some key KPIs" },
          { value: "fully_integrated", label: "They’re fully integrated with business metrics" },
        ]}
        value={answers["cx_metrics_alignment"] || ""}
        onChange={(val) => onAnswer("cx_metrics_alignment", val)}
      />
    </div>
  );
}
