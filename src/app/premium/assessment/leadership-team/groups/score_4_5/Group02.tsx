"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["coaching_rhythm"] === "string" &&
    typeof answers["employee_autonomy"] === "string" &&
    typeof answers["leader_visibility"] === "string" &&
    typeof answers["crisis_leadership"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: coaching_rhythm */}
      <MultipleChoiceQuestion
        question="How consistent is the coaching and development of employees?"
        options={[
          { value: "ad_hoc", label: "It happens ad hoc when needed" },
          { value: "periodic", label: "We check in periodically" },
          { value: "structured", label: "We have a structured cadence of coaching" },
          { value: "embedded", label: "It’s embedded into daily leadership practices" },
        ]}
        value={getStringAnswer(answers["coaching_rhythm"])}
        onChange={(val) => onAnswer("coaching_rhythm", val)}
      />

      {/* Question 5: employee_autonomy */}
      <MultipleChoiceQuestion
        question="How do leaders promote autonomy while maintaining accountability?"
        options={[
          { value: "micromanage", label: "We tend to micromanage to stay on track" },
          { value: "light_autonomy", label: "There’s light autonomy but limited trust" },
          { value: "balanced_approach", label: "Leaders give autonomy with clear expectations" },
          { value: "empowered_frameworks", label: "Autonomy is empowered through frameworks and metrics" },
        ]}
        value={getStringAnswer(answers["employee_autonomy"])}
        onChange={(val) => onAnswer("employee_autonomy", val)}
      />

      {/* Question 6: leader_visibility */}
      <MultipleChoiceQuestion
        question="How visible and accessible are leaders to their teams?"
        options={[
          { value: "mostly_unseen", label: "They’re mostly unseen except in major meetings" },
          { value: "some_access", label: "There’s some access during key projects" },
          { value: "present_and_available", label: "They’re present and available" },
          { value: "consistently_engaged", label: "Leaders consistently engage with teams across levels" },
        ]}
        value={getStringAnswer(answers["leader_visibility"])}
        onChange={(val) => onAnswer("leader_visibility", val)}
      />

      {/* Question 7: crisis_leadership */}
      <MultipleChoiceQuestion
        question="How do leaders typically respond in times of crisis or uncertainty?"
        options={[
          { value: "delayed_response", label: "We’re slow to respond and often reactive" },
          { value: "rally_and_support", label: "We rally and support each other" },
          { value: "focused_adaptation", label: "We adapt with focus and communication" },
          { value: "decisive_and_empowering", label: "Leaders are decisive and empower others to act" },
        ]}
        value={getStringAnswer(answers["crisis_leadership"])}
        onChange={(val) => onAnswer("crisis_leadership", val)}
      />
    </div>
  );
}
