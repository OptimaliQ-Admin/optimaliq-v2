"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["tool_consistency"] === "string" &&
    typeof answers["training_access"] === "string" &&
    typeof answers["model_monitoring"] === "string" &&
    typeof answers["ai_scaling"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: tool_consistency */}
      <MultipleChoiceQuestion
        question="How consistent are the AI and automation tools used across different teams?"
        options={[
          { value: "very_inconsistent", label: "Very inconsistent — every team uses something different" },
          { value: "some_alignment", label: "Some alignment but not standardized" },
          { value: "standardized", label: "Standardized tools across most teams" },
          { value: "integrated_stack", label: "Fully integrated and aligned tool stack" },
        ]}
        value={answers["tool_consistency"] || ""}
        onChange={(val) => onAnswer("tool_consistency", val)}
      />

      {/* Question 5: training_access */}
      <MultipleChoiceQuestion
        question="Do employees have access to training on AI, automation, or data tools?"
        options={[
          { value: "no_training", label: "No — we don’t offer any training" },
          { value: "ad_hoc", label: "Occasional resources, but not structured" },
          { value: "some_training", label: "Some structured training programs available" },
          { value: "strong_focus", label: "Yes — training is a strategic focus" },
        ]}
        value={answers["training_access"] || ""}
        onChange={(val) => onAnswer("training_access", val)}
      />

      {/* Question 6: model_monitoring */}
      <MultipleChoiceQuestion
        question="How do you monitor the performance of AI or automated systems once deployed?"
        options={[
          { value: "we_dont", label: "We don’t — it’s manual or reactive" },
          { value: "spot_checks", label: "Occasional spot checks" },
          { value: "metrics_and_logs", label: "We track performance via logs or metrics" },
          { value: "real_time_monitoring", label: "We use real-time monitoring and alerts" },
        ]}
        value={answers["model_monitoring"] || ""}
        onChange={(val) => onAnswer("model_monitoring", val)}
      />

      {/* Question 7: ai_scaling */}
      <MultipleChoiceQuestion
        question="How easily can your AI or automation efforts scale across departments or locations?"
        options={[
          { value: "not_scalable", label: "Not easily — we’d have to rebuild everything" },
          { value: "some_scalability", label: "Some components could be reused" },
          { value: "scalable_with_effort", label: "Scalable, but requires coordination" },
          { value: "highly_scalable", label: "Highly scalable by design" },
        ]}
        value={answers["ai_scaling"] || ""}
        onChange={(val) => onAnswer("ai_scaling", val)}
      />
    </div>
  );
}
