"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3_5_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitive_tracking"] === "string" &&
    typeof answers["market_positioning"] === "string" &&
    typeof answers["trend_responsiveness"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: competitive_tracking */}
      <MultipleChoiceQuestion
        question="How actively do you track competitor moves, new entrants, or market shifts?"
        options={[
          { value: "rarely", label: "Rarely — we react when things show up in the news" },
          { value: "ad_hoc", label: "Ad hoc — only when someone flags something" },
          { value: "light_monitoring", label: "We monitor a few players but not consistently" },
          { value: "dedicated", label: "We have a dedicated process or tool for monitoring" },
        ]}
        value={answers["competitive_tracking"] || ""}
        onChange={(val) => onAnswer("competitive_tracking", val)}
      />

      {/* Question 5: market_positioning */}
      <MultipleChoiceQuestion
        question="How would you rate your company’s ability to clearly position itself in the market?"
        options={[
          { value: "unclear", label: "Unclear — our messaging is inconsistent or vague" },
          { value: "emerging", label: "Emerging — we have some positioning statements" },
          { value: "clear", label: "Clear — we can articulate how we’re different" },
          { value: "strong", label: "Strong — we’re well-known for our positioning" },
        ]}
        value={answers["market_positioning"] || ""}
        onChange={(val) => onAnswer("market_positioning", val)}
      />

      {/* Question 6: trend_responsiveness */}
      <MultipleChoiceQuestion
        question="How responsive is your business to changing trends, behaviors, or competitor strategies?"
        options={[
          { value: "behind", label: "We’re often behind the curve" },
          { value: "slow_to_move", label: "We move slowly — change takes time" },
          { value: "fairly_quick", label: "We can shift quickly when needed" },
          { value: "proactive", label: "We’re proactive and often set the pace" },
        ]}
        value={answers["trend_responsiveness"] || ""}
        onChange={(val) => onAnswer("trend_responsiveness", val)}
      />
    </div>
  );
}
