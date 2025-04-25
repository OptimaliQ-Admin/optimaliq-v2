"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["channel_scalability"] === "string" &&
    typeof answers["ai_usage"] === "string" &&
    typeof answers["campaign_measurement"] === "string" &&
    typeof answers["next_experiment"] === "string" &&
    answers["next_experiment"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 7: channel_scalability */}
      <MultipleChoiceQuestion
        question="Which best describes the scalability of your marketing channels?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — dependent on manual effort" },
          { value: "some_automation", label: "Some automation — scaling takes effort" },
          { value: "repeatable_systems", label: "We have repeatable systems for growth" },
          { value: "scalable_foundation", label: "We’ve built a scalable, multi-channel foundation" }
        ]}
        value={getStringAnswer(answers["channel_scalability"])}
        onChange={(val) => onAnswer("channel_scalability", val)}
      />

      {/* Question 8: ai_usage */}
      <MultipleChoiceQuestion
        question="How does your team use AI or automation in marketing today?"
        options={[
          { value: "not_using_ai", label: "We’re not using it yet" },
          { value: "limited_use", label: "We use AI tools in limited ways (e.g. copywriting)" },
          { value: "embedded_in_ops", label: "It’s embedded in campaign operations" },
          { value: "strategic_driver", label: "AI is a strategic driver of marketing performance" }
        ]}
        value={getStringAnswer(answers["ai_usage"])}
        onChange={(val) => onAnswer("ai_usage", val)}
      />

      {/* Question 9: campaign_measurement */}
      <MultipleChoiceQuestion
        question="How do you evaluate the success of your marketing programs?"
        options={[
          { value: "vanity_metrics", label: "We look at vanity metrics like impressions" },
          { value: "engagement", label: "We measure engagement and leads" },
          { value: "pipeline", label: "We track influence on pipeline and revenue" },
          { value: "roi", label: "We measure ROI and customer lifetime value" }
        ]}
        value={getStringAnswer(answers["campaign_measurement"])}
        onChange={(val) => onAnswer("campaign_measurement", val)}
      />

      {/* Question 10: next_experiment */}
      <TextAreaQuestion
        question="What’s one marketing experiment you’d like to try next?"
        placeholder="E.g., test a new acquisition channel, launch a lifecycle journey, etc."
        value={getStringAnswer(answers["next_experiment"])}
        onChange={(val) => onAnswer("next_experiment", val)}
        maxLength={300}
      />
    </div>
  );
}
