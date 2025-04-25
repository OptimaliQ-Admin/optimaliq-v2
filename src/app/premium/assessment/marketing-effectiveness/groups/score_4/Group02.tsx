"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["channel_strategy"] === "string" &&
    typeof answers["agile_campaigns"] === "string" &&
    typeof answers["cross_team_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 4: channel_strategy */}
      <MultipleChoiceQuestion
        question="How are channels selected and prioritized in your marketing mix?"
        options={[
          { value: "gut_or_history", label: "Based on gut feel or history" },
          { value: "retrospective", label: "Based on what worked last time" },
          { value: "planned_tests", label: "We plan tests based on data" },
          { value: "data_driven_prioritization", label: "Data-driven prioritization with spend modeling" }
        ]}
        value={getStringAnswer(answers["channel_strategy"])}
        onChange={(val) => onAnswer("channel_strategy", val)}
      />

      {/* Question 5: agile_campaigns */}
      <MultipleChoiceQuestion
        question="How agile is your marketing team when performance underperforms?"
        options={[
          { value: "weeks_or_longer", label: "It takes weeks or longer to adjust" },
          { value: "some_flexibility", label: "We make small updates but rarely change full campaigns" },
          { value: "tactical_changes", label: "We make tactical changes within a few days" },
          { value: "real_time_adapt", label: "We adapt in near real-time with automated triggers" }
        ]}
        value={getStringAnswer(answers["agile_campaigns"])}
        onChange={(val) => onAnswer("agile_campaigns", val)}
      />

      {/* Question 6: cross_team_alignment */}
      <MultipleChoiceQuestion
        question="How well aligned is your marketing team with sales, product, and CS?"
        options={[
          { value: "siloed", label: "It’s siloed — we rarely collaborate" },
          { value: "collaborate_quarterly", label: "We collaborate quarterly" },
          { value: "share_goals", label: "We share goals and campaign themes" },
          { value: "fully_integrated", label: "We’re fully integrated on shared KPIs" }
        ]}
        value={getStringAnswer(answers["cross_team_alignment"])}
        onChange={(val) => onAnswer("cross_team_alignment", val)}
      />
    </div>
  );
}
