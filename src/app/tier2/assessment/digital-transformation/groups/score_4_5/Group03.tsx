"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["integration_readiness"] === "string" &&
    typeof answers["partner_ecosystem"] === "string" &&
    typeof answers["future_proofing"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How would you describe your readiness to integrate new technologies (e.g., automation, personalization, AI)?"
        options={[
          { value: "resistant", label: "We’re typically resistant or slow to adopt" },
          { value: "selective", label: "We’re selective and cautious" },
          { value: "proactive", label: "We’re proactive and test frequently" },
          { value: "embedded", label: "We’re fast-moving and integration-ready by default" }
        ]}
        value={answers["integration_readiness"] || ""}
        onChange={(val) => onAnswer("integration_readiness", val)}
      />

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How do you approach external tech partnerships (e.g., platforms, vendors, consultants)?"
        options={[
          { value: "minimal_use", label: "We rarely use outside partners" },
          { value: "as_needed", label: "We bring in help when needed" },
          { value: "strategic_support", label: "We engage partners for strategic support" },
          { value: "deep_ecosystem", label: "We have a deep ecosystem of partners integrated into our roadmap" }
        ]}
        value={answers["partner_ecosystem"] || ""}
        onChange={(val) => onAnswer("partner_ecosystem", val)}
      />

      {/* Question 9 */}
      <TextAreaQuestion
        question="What’s one technology or trend you believe your company will need to adopt in the next 12–24 months?"
        placeholder="E.g., Generative AI, CDP, Blockchain, Privacy infrastructure"
        value={answers["future_proofing"] || ""}
        onChange={(val) => onAnswer("future_proofing", val)}
        maxLength={300}
      />
    </div>
  );
}
