"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["pipeline_review_frequency"] === "string" &&
    answers["pipeline_review_frequency"].trim().length > 0 &&
    typeof answers["qualification_process"] === "string" &&
    answers["qualification_process"].trim().length > 0 &&
    typeof answers["important_metrics"] === "string" &&
    answers["important_metrics"].trim().length > 0 &&
    typeof answers["stage_progression"] === "string" &&
    answers["stage_progression"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: pipeline_review_frequency */}
      <MultipleChoiceQuestion
        question="How often do you review or update your pipeline data?"
        options={[
          { value: "rarely", label: "Rarely — only when needed" },
          { value: "monthly", label: "Occasionally, maybe once a month" },
          { value: "weekly", label: "Weekly pipeline reviews or updates" },
          { value: "daily_realtime", label: "Daily or real-time updates and monitoring" },
        ]}
        value={answers["pipeline_review_frequency"] || ""}
        onChange={(val) => onAnswer("pipeline_review_frequency", val)}
      />

      {/* Question 5: qualification_process */}
      <MultipleChoiceQuestion
        question="How would you describe your lead qualification process?"
        options={[
          { value: "gut_feel", label: "Very informal — we go with gut feel" },
          { value: "some_questions", label: "We ask a few basic questions" },
          { value: "defined_criteria", label: "We follow defined criteria" },
          { value: "scoring_model", label: "We use a formal scoring model" },
        ]}
        value={answers["qualification_process"] || ""}
        onChange={(val) => onAnswer("qualification_process", val)}
      />

      {/* Question 6: important_metrics */}
      <TextAreaQuestion
        question="What sales metrics are most important to you right now?"
        placeholder="E.g., lead-to-close ratio, deal size, win rate, etc."
        value={answers["important_metrics"] || ""}
        onChange={(val) => onAnswer("important_metrics", val)}
        maxLength={300}
      />

      {/* Question 7: stage_progression */}
      <MultipleChoiceQuestion
        question="How consistently do you move leads through each stage of your pipeline?"
        options={[
          { value: "skip_stages", label: "We skip or rush through stages" },
          { value: "loose_progression", label: "We loosely follow the stages" },
          { value: "structured_flow", label: "We follow a structured progression" },
          { value: "enforced_process", label: "We enforce progression with exit criteria" },
        ]}
        value={answers["stage_progression"] || ""}
        onChange={(val) => onAnswer("stage_progression", val)}
      />
    </div>
  );
}
