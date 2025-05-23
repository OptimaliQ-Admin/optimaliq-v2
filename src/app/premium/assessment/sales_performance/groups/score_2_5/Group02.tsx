"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["which_96e79e"]) &&
    answers["which_96e79e"].length > 0 &&
    typeof answers["how_18d03b"] === "string" &&
    typeof answers["what’s_f1fd32"] === "string" &&
    typeof answers["how_86d3d9"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  const tracked = answers["which_96e79e"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: how_4cd27c */}
      <MultipleChoiceQuestion
        question="How do you handle sales performance issues or opportunities?"
        options={[
          { value: "reactive", label: "We react to issues after they occur" },
          { value: "weekly_review", label: "We review metrics weekly" },
          { value: "proactive", label: "We proactively adjust based on data" },
          { value: "forecasting", label: "We run forecasts and modeling" },
        ]}
        value={getStringAnswer(answers["how_4cd27c"])}
        onChange={(val) => onAnswer("how_4cd27c", val)}
      />

      {/* Question 5: how_68cbdb */}
      <MultipleChoiceQuestion
        question="How do you handle pipeline reviews?"
        options={[
          { value: "no_review", label: "We don't have a pipeline review" },
          { value: "as_needed", label: "We review as needed" },
          { value: "regular_reviews", label: "We do regular reviews with leads" },
          { value: "structured", label: "We have structured weekly pipeline reviews" },
        ]}
        value={getStringAnswer(answers["how_68cbdb"])}
        onChange={(val) => onAnswer("how_68cbdb", val)}
      />

      {/* Question 6: how_a4d10a */}
      <MultiSelectQuestion
        question="Which of the following do you use to improve sales performance?"
        options={[
          { value: "call_recordings", label: "Call recordings" },
          { value: "crm_notes", label: "CRM notes" },
          { value: "chat_messages", label: "Slack or chat messages" },
          { value: "deal_reviews", label: "Deal review meetings" },
          { value: "rep_feedback", label: "Rep feedback" },
        ]}
        selected={Array.isArray(getArrayAnswer(answers["how_a4d10a"])) ? getArrayAnswer(answers["how_a4d10a"]) : []}
        onChange={(val) => onAnswer("how_a4d10a", val)}
        maxSelect={5}
      />
    </div>
  );
}
