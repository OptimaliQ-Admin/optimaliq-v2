"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["lifecycle_strategy"] === "string" &&
    typeof answers["exploratory_channel"] === "string" &&
    typeof answers["scalability_confidence"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: lifecycle_strategy */}
      <MultipleChoiceQuestion
        question="How would you describe your lifecycle marketing strategy?"
        options={[
          { value: "no_strategy", label: "We don’t really have one" },
          { value: "basic_journeys", label: "We use basic journeys like welcome or abandon cart" },
          { value: "segmented_automation", label: "We have segmented automation by stage or persona" },
          { value: "full_lifecycle", label: "We orchestrate a full lifecycle strategy across teams" },
        ]}
        value={getStringAnswer(answers["lifecycle_strategy"])}
        onChange={(val) => onAnswer("lifecycle_strategy", val)}
      />

      {/* Question 9: exploratory_channel */}
      <TextAreaQuestion
        question="What’s one marketing channel you’ve been curious about exploring but haven’t tried yet?"
        placeholder="E.g. TikTok, podcasts, SMS, affiliate marketing, etc."
        value={getStringAnswer(answers["exploratory_channel"])}
        onChange={(val) => onAnswer("exploratory_channel", val)}
        maxLength={300}
      />

      {/* Question 10: scalability_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your current marketing can scale with your growth goals?"
        options={[
          { value: "not_confident", label: "Not confident at all" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "mostly_confident", label: "Mostly confident" },
          { value: "very_confident", label: "Very confident — it’s a strength" },
        ]}
        value={getStringAnswer(answers["scalability_confidence"])}
        onChange={(val) => onAnswer("scalability_confidence", val)}
      />
    </div>
  );
}
