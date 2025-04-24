"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_tools_used"] === "string" &&
    typeof answers["risk_concern"] === "string" &&
    typeof answers["adoption_barrier"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_tools_used */}
      <MultipleChoiceQuestion
        question="What AI or automation tools are you currently using (if any)?"
        options={[
          { value: "none", label: "None yet" },
          { value: "basic", label: "Some basic tools (e.g. ChatGPT, Zapier)" },
          { value: "business_apps", label: "Tools integrated into business apps (e.g. HubSpot AI)" },
          { value: "dedicated_platforms", label: "Dedicated AI platforms or automation systems" },
        ]}
        value={getStringAnswer(answers["ai_tools_used"])}
        onChange={(val) => onAnswer("ai_tools_used", val)}
      />

      {/* Question 9: risk_concern */}
      <MultipleChoiceQuestion
        question="How concerned are you about the risks of using AI (bias, privacy, accuracy)?"
        options={[
          { value: "not_thinking_about_it", label: "We haven’t really thought about it" },
          { value: "mildly_concerned", label: "Mildly concerned — we’re exploring the topic" },
          { value: "actively_considering", label: "Actively considering — we’re cautious" },
          { value: "have_policies", label: "We’ve developed internal guidelines or policies" },
        ]}
        value={getStringAnswer(answers["risk_concern"])}
        onChange={(val) => onAnswer("risk_concern", val)}
      />

      {/* Question 10: adoption_barrier */}
      <MultipleChoiceQuestion
        question="What’s the biggest barrier to wider AI adoption in your business?"
        options={[
          { value: "lack_of_time", label: "Lack of time or focus" },
          { value: "skills_gap", label: "Team doesn’t have the skills" },
          { value: "low_confidence", label: "We’re unsure what’s possible or where to start" },
          { value: "other_priorities", label: "Other initiatives are higher priority" },
        ]}
        value={getStringAnswer(answers["adoption_barrier"])}
        onChange={(val) => onAnswer("adoption_barrier", val)}
      />
    </div>
  );
}
