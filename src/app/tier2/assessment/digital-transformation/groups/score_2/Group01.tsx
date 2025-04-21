"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["integration_consistency"] === "string" &&
    typeof answers["data_strategy_alignment"] === "string" &&
    Array.isArray(answers["channels_used"]) &&
    answers["channels_used"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      
      {/* Question 1: integration_consistency */}
      <MultipleChoiceQuestion
        question="How consistently do your systems and platforms share data across the business?"
        options={[
          { value: "not_consistent", label: "Not at all — most tools don’t talk to each other" },
          { value: "partially_consistent", label: "Some tools share data, but it’s inconsistent" },
          { value: "mostly_consistent", label: "Data sharing works in most areas" },
          { value: "fully_consistent", label: "Yes — everything is synced across tools" },
        ]}
        value={answers["integration_consistency"] || ""}
        onChange={(val) => onAnswer("integration_consistency", val)}
      />

      {/* Question 2: data_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How well does your current tech stack align with your business goals or growth strategy?"
        options={[
          { value: "no_alignment", label: "Not at all — we haven’t thought about it" },
          { value: "some_alignment", label: "It somewhat aligns, but gaps exist" },
          { value: "mostly_aligned", label: "It supports most of our growth plans" },
          { value: "fully_aligned", label: "It’s intentionally built to align with our goals" },
        ]}
        value={answers["data_strategy_alignment"] || ""}
        onChange={(val) => onAnswer("data_strategy_alignment", val)}
      />

      {/* Question 3: channels_used */}
      <MultiSelectQuestion
        question="Which digital channels do you actively use for customer engagement?"
        options={[
          { value: "email", label: "Email marketing" },
          { value: "sms", label: "SMS or mobile push" },
          { value: "social", label: "Social media" },
          { value: "website", label: "Website personalization" },
          { value: "paid_ads", label: "Paid advertising" },
          { value: "none", label: "None of these" },
        ]}
        selected={answers["channels_used"] || []}
        onChange={(val) => onAnswer("channels_used", val)}
        maxSelect={5}
      />
    </div>
  );
}
