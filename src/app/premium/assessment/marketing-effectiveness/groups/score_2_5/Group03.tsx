"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["goal_setting_process"] === "string" &&
    typeof answers["underperforming_area"] === "string" &&
    typeof answers["marketing_scalability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: goal_setting_process */}
      <MultipleChoiceQuestion
        question="What’s your current process for setting and reviewing marketing goals?"
        options={[
          { value: "No formal process", label: "No formal process" },
          { value: "Set quarterly, reviewed occasionally", label: "Set quarterly, reviewed occasionally" },
          { value: "Tracked with reporting and metrics", label: "Tracked with reporting and metrics" },
          { value: "Aligned to KPIs and actively managed", label: "Aligned to KPIs and actively managed" },
        ]}
        value={getStringAnswer(answers["goal_setting_process"])}
        onChange={(val) => onAnswer("goal_setting_process", val)}
      />

      {/* Question 9: underperforming_area */}
      <TextAreaQuestion
        question="What’s one thing you know is underperforming but haven’t addressed yet?"
        placeholder="E.g. ad fatigue, content gaps, abandoned cart emails"
        value={getStringAnswer(answers["underperforming_area"])}
        onChange={(val) => onAnswer("underperforming_area", val)}
        maxLength={300}
      />

      {/* Question 10: marketing_scalability */}
      <MultipleChoiceQuestion
        question="How scalable are your current marketing systems and processes?"
        options={[
          { value: "Not scalable at all", label: "Not scalable at all" },
          { value: "We’d struggle but could grow", label: "We’d struggle but could grow" },
          { value: "Mostly scalable with tweaks", label: "Mostly scalable with tweaks" },
          { value: "Fully scalable and documented", label: "Fully scalable and documented" },
        ]}
        value={getStringAnswer(answers["marketing_scalability"])}
        onChange={(val) => onAnswer("marketing_scalability", val)}
      />
    </div>
  );
}
