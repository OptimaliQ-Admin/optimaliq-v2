"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["decision_making_style"] === "string" &&
    typeof answers["communication_frequency"] === "string" &&
    typeof answers["leader_visibility"] === "string" &&
    typeof answers["feedback_culture"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: decision_making_style */}
      <MultipleChoiceQuestion
        question="How would you describe your leadership team’s decision-making style?"
        options={[
          { value: "top_down", label: "Top-down with little input" },
          { value: "informal_input", label: "Leaders ask for informal input" },
          { value: "collaborative", label: "Collaborative — input shapes decisions" },
          { value: "empowered", label: "Empowered — teams own decisions within guardrails" },
        ]}
        value={getStringAnswer(answers["decision_making_style"])}
        onChange={(val) => onAnswer("decision_making_style", val)}
      />

      {/* Question 5: communication_frequency */}
      <MultipleChoiceQuestion
        question="How often do leaders communicate updates on company performance or direction?"
        options={[
          { value: "rarely", label: "Rarely — only during major events" },
          { value: "ad_hoc", label: "Ad hoc — when they remember" },
          { value: "scheduled", label: "On a regular cadence (monthly or quarterly)" },
          { value: "ongoing", label: "Ongoing, transparent, and frequent communication" },
        ]}
        value={getStringAnswer(answers["communication_frequency"])}
        onChange={(val) => onAnswer("communication_frequency", val)}
      />

      {/* Question 6: leader_visibility */}
      <MultipleChoiceQuestion
        question="How visible and approachable are your executive leaders?"
        options={[
          { value: "not_visible", label: "Not visible — they feel disconnected" },
          { value: "some_visibility", label: "Somewhat visible — we occasionally see them" },
          { value: "approachable", label: "Approachable — people feel comfortable raising ideas" },
          { value: "very_accessible", label: "Very accessible — leaders make time regularly" },
        ]}
        value={getStringAnswer(answers["leader_visibility"])}
        onChange={(val) => onAnswer("leader_visibility", val)}
      />

      {/* Question 7: feedback_culture */}
      <MultipleChoiceQuestion
        question="How would you describe the feedback culture across your teams?"
        options={[
          { value: "no_feedback", label: "We don’t really give feedback" },
          { value: "basic_feedback", label: "Occasional — mostly during performance reviews" },
          { value: "team_based", label: "Regular within teams, but not across departments" },
          { value: "continuous_feedback", label: "Continuous — up, down, and across the org" },
        ]}
        value={getStringAnswer(answers["feedback_culture"])}
        onChange={(val) => onAnswer("feedback_culture", val)}
      />
    </div>
  );
}
