"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["feedback_adoption"] === "string" &&
    typeof answers["trend_analysis_depth"] === "string" &&
    typeof answers["competitive_reaction_time"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How effectively do you convert benchmarking or customer feedback into action?"
        options={[
          { value: "rarely", label: "Rarely — it’s noted but not acted on" },
          { value: "sometimes", label: "Sometimes — if it aligns with current projects" },
          { value: "proactively", label: "Proactively — we apply it to planning and roadmaps" },
          { value: "always", label: "Always — feedback loops directly inform execution" },
        ]}
        value={getStringAnswer(answers["feedback_adoption"])}
        onChange={(val) => onAnswer("feedback_adoption", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="What’s your approach to identifying market trends or shifts?"
        options={[
          { value: "gut_feel", label: "Mostly gut feel or anecdotal" },
          { value: "ad_hoc_reviews", label: "Ad hoc reviews of trends or news" },
          { value: "formal_tracking", label: "We track trends quarterly or in strategy cycles" },
          { value: "real_time_tracking", label: "We monitor and analyze trends in real time" },
        ]}
        value={getStringAnswer(answers["trend_analysis_depth"])}
        onChange={(val) => onAnswer("trend_analysis_depth", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How quickly can your team adapt based on new benchmarking or market data?"
        options={[
          { value: "slow", label: "Slow — we may adjust next year" },
          { value: "delayed", label: "Delayed — updates take months" },
          { value: "moderate", label: "Moderate — we adapt within a quarter" },
          { value: "agile", label: "Agile — we shift priorities within weeks" },
        ]}
        value={getStringAnswer(answers["competitive_reaction_time"])}
        onChange={(val) => onAnswer("competitive_reaction_time", val)}
      />
    </div>
  );
}
