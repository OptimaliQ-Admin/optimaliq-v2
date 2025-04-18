"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["persona_revision"] === "string" &&
    typeof answers["marketing_confidence"] === "string" &&
    typeof answers["innovation_balance"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: persona_revision */}
      <MultipleChoiceQuestion
        question="How often do you revisit and revise your ideal customer personas?"
        options={[
          { value: "rarely", label: "Rarely — they stay mostly the same" },
          { value: "annually", label: "Annually or during planning cycles" },
          { value: "frequently", label: "Frequently — based on new data" },
          { value: "continuous", label: "Continuously — it’s part of our GTM strategy" }
        ]}
        value={answers["persona_revision"] || ""}
        onChange={(val) => onAnswer("persona_revision", val)}
      />

      {/* Question 5: marketing_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in marketing’s ability to forecast impact and influence pipeline?"
        options={[
          { value: "low_confidence", label: "Low confidence — too many unknowns" },
          { value: "medium_confidence", label: "Moderate — we’re improving visibility" },
          { value: "high_confidence", label: "High — we can estimate impact per program" },
          { value: "full_confidence", label: "Very high — our forecasts inform strategic decisions" }
        ]}
        value={answers["marketing_confidence"] || ""}
        onChange={(val) => onAnswer("marketing_confidence", val)}
      />

      {/* Question 6: innovation_balance */}
      <MultipleChoiceQuestion
        question="How do you balance innovation with optimization in your campaigns?"
        options={[
          { value: "mostly_optimize", label: "We mostly optimize what we know" },
          { value: "occasionally_test", label: "We occasionally test new formats" },
          { value: "consistent_experimentation", label: "We regularly run experiments alongside core campaigns" },
          { value: "innovation_driven", label: "We intentionally fund innovation and track ROI" }
        ]}
        value={answers["innovation_balance"] || ""}
        onChange={(val) => onAnswer("innovation_balance", val)}
      />
    </div>
  );
}
