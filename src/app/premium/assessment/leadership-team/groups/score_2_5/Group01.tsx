"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["manager_training"] === "string" &&
    typeof answers["meeting_culture"] === "string" &&
    typeof answers["goal_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: manager_training */}
      <MultipleChoiceQuestion
        question="What kind of training or support do managers receive?"
        options={[
          { value: "none", label: "None — we rely on experience or common sense" },
          { value: "peer_sharing", label: "Occasional peer sharing or guidance" },
          { value: "internal_training", label: "Internal training or onboarding" },
          { value: "ongoing_programs", label: "Ongoing development programs" },
        ]}
        value={getStringAnswer(answers["manager_training"])}
        onChange={(val) => onAnswer("manager_training", val)}
      />

      {/* Question 2: meeting_culture */}
      <MultipleChoiceQuestion
        question="How would you describe your meeting culture?"
        options={[
          { value: "frequent_unproductive", label: "Frequent but often unproductive" },
          { value: "informal_checkins", label: "Mostly informal check-ins" },
          { value: "structured_and_goal_oriented", label: "Structured and goal-oriented" },
          { value: "streamlined_and_purposeful", label: "Streamlined and highly purposeful" },
        ]}
        value={getStringAnswer(answers["meeting_culture"])}
        onChange={(val) => onAnswer("meeting_culture", val)}
      />

      {/* Question 3: goal_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are team goals with company strategy?"
        options={[
          { value: "no_clear_alignment", label: "No clear alignment" },
          { value: "some_alignment", label: "Some alignment, but not tracked" },
          { value: "frequent_sync", label: "Teams sync goals frequently" },
          { value: "tight_alignment", label: "Goals are tightly aligned and tracked" },
        ]}
        value={getStringAnswer(answers["goal_alignment"])}
        onChange={(val) => onAnswer("goal_alignment", val)}
      />
    </div>
  );
}
