"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["messaging_consistency"] === "string" &&
    typeof answers["team_collab"] === "string" &&
    typeof answers["customer_insights"] === "string" &&
    typeof answers["campaign_review_cycle"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How consistent is your messaging across marketing channels?"
        options={[
          { value: "inconsistent", label: "Inconsistent — varies by channel" },
          { value: "somewhat_consistent", label: "Somewhat consistent — we try to align" },
          { value: "mostly_consistent", label: "Mostly — a central message is used" },
          { value: "fully_consistent", label: "Fully consistent — we use unified messaging" },
        ]}
        value={answers["messaging_consistency"] || ""}
        onChange={(val) => onAnswer("messaging_consistency", val)}
      />

      <MultipleChoiceQuestion
        question="How well does your marketing team collaborate with other departments?"
        options={[
          { value: "rarely", label: "Rarely — we work in silos" },
          { value: "sometimes", label: "Sometimes — mostly during launches" },
          { value: "collaborative", label: "We collaborate on goals and priorities" },
          { value: "fully_integrated", label: "We're fully integrated into cross-functional teams" },
        ]}
        value={answers["team_collab"] || ""}
        onChange={(val) => onAnswer("team_collab", val)}
      />

      <MultipleChoiceQuestion
        question="How often do you gather insights directly from customers?"
        options={[
          { value: "never", label: "Never — we rely on assumptions" },
          { value: "occasionally", label: "Occasionally — via surveys or feedback" },
          { value: "regularly", label: "Regularly — structured insight collection" },
          { value: "real_time", label: "In real-time — voice of customer systems in place" },
        ]}
        value={answers["customer_insights"] || ""}
        onChange={(val) => onAnswer("customer_insights", val)}
      />

      <MultipleChoiceQuestion
        question="How often do you review campaign results and apply learnings?"
        options={[
          { value: "rarely", label: "Rarely — only if something breaks" },
          { value: "sometimes", label: "Sometimes — for big campaigns" },
          { value: "often", label: "Often — we review after most campaigns" },
          { value: "always", label: "Always — it's part of our workflow" },
        ]}
        value={answers["campaign_review_cycle"] || ""}
        onChange={(val) => onAnswer("campaign_review_cycle", val)}
      />
    </div>
  );
}
