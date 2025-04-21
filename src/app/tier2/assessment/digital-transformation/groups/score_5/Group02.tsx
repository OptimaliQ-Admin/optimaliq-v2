"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_impact"] === "string" &&
    typeof answers["talent_strategy"] === "string" &&
    Array.isArray(answers["external_influence"]) &&
    answers["external_influence"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  const externalInfluence = answers["external_influence"] || [];

  return (
    <div className="space-y-10">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="What impact is AI having on your transformation efforts?"
        options={[
          { value: "not_applicable", label: "It’s not applicable yet" },
          { value: "selective_use", label: "We use it in select functions" },
          { value: "broadly_embedded", label: "It’s broadly embedded in workflows" },
          { value: "core_enabler", label: "It’s a core enabler of our digital strategy" }
        ]}
        value={answers["ai_impact"] || ""}
        onChange={(val) => onAnswer("ai_impact", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="Which statement best reflects your digital talent strategy?"
        options={[
          { value: "limited_internal", label: "We rely heavily on external partners" },
          { value: "growing_internal", label: "We’re building internal skills gradually" },
          { value: "hybrid_model", label: "We use a hybrid of internal teams and partners" },
          { value: "internal_center", label: "We have strong internal capabilities across domains" }
        ]}
        value={answers["talent_strategy"] || ""}
        onChange={(val) => onAnswer("talent_strategy", val)}
      />

      {/* Question 6 */}
      <MultiSelectQuestion
        question="Which external factors most influence your transformation roadmap?"
        options={[
          { value: "regulatory_changes", label: "Regulatory or compliance changes" },
          { value: "market_shifts", label: "Market or customer behavior shifts" },
          { value: "tech_innovation", label: "Technology breakthroughs" },
          { value: "competitive_pressure", label: "Competitive pressure or disruption" },
          { value: "board_mandate", label: "Board-level mandates or goals" }
        ]}
        selected={externalInfluence}
        onChange={(val) => onAnswer("external_influence", val)}
        maxSelect={5}
      />
    </div>
  );
}
