"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitive_tools"] === "string" &&
    typeof answers["positioning_consistency"] === "string" &&
    typeof answers["market_awareness"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      
      {/* Question 8: competitive_tools */}
      <MultipleChoiceQuestion
        question="What tools or sources do you use to gather competitive intelligence?"
        options={[
          { value: "none", label: "None — it’s ad hoc or anecdotal" },
          { value: "free_tools", label: "Free tools or news alerts" },
          { value: "internal_tracking", label: "Internal tracking or shared docs" },
          { value: "dedicated_platforms", label: "Dedicated platforms and subscriptions" },
        ]}
        value={getStringAnswer(answers["competitive_tools"])}
        onChange={(val) => onAnswer("competitive_tools", val)}
      />

      {/* Question 9: positioning_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is your company’s messaging vs. competitors across channels?"
        options={[
          { value: "inconsistent", label: "Very inconsistent" },
          { value: "somewhat_consistent", label: "Somewhat consistent — depends on team or campaign" },
          { value: "mostly_consistent", label: "Mostly consistent with occasional drift" },
          { value: "fully_aligned", label: "Fully aligned and reinforced across all channels" },
        ]}
        value={getStringAnswer(answers["positioning_consistency"])}
        onChange={(val) => onAnswer("positioning_consistency", val)}
      />

      {/* Question 10: market_awareness */}
      <MultipleChoiceQuestion
        question="How confident are you in your team’s awareness of competitive market shifts?"
        options={[
          { value: "not_confident", label: "Not confident" },
          { value: "somewhat_aware", label: "Somewhat aware, but delayed" },
          { value: "fairly_informed", label: "Fairly informed on key developments" },
          { value: "very_confident", label: "Very confident — we track and share insights regularly" },
        ]}
        value={getStringAnswer(answers["market_awareness"])}
        onChange={(val) => onAnswer("market_awareness", val)}
      />
    </div>
  );
}
