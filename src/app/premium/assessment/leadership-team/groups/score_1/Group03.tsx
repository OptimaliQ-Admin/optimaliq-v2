"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["values_alignment"] === "string" &&
    typeof answers["team_recognition"] === "string" &&
    typeof answers["growth_opportunity"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: values_alignment */}
      <MultipleChoiceQuestion
        question="How well are the company’s values reflected in day-to-day leadership behavior?"
        options={[
          { value: "not_aligned", label: "They’re just words — not really lived" },
          { value: "some_alignment", label: "Some leaders model the values" },
          { value: "mostly_aligned", label: "Mostly aligned — behavior reflects the values" },
          { value: "fully_embodied", label: "Fully embodied — values drive our culture" },
        ]}
        value={getStringAnswer(answers["values_alignment"])}
        onChange={(val) => onAnswer("values_alignment", val)}
      />

      {/* Question 9: team_recognition */}
      <MultipleChoiceQuestion
        question="How often do leaders recognize team or individual contributions?"
        options={[
          { value: "never", label: "Rarely or never" },
          { value: "occasionally", label: "Occasionally during reviews or meetings" },
          { value: "frequently", label: "Frequently — leaders call out wins often" },
          { value: "systematically", label: "We have structured recognition systems" },
        ]}
        value={getStringAnswer(answers["team_recognition"])}
        onChange={(val) => onAnswer("team_recognition", val)}
      />

      {/* Question 10: growth_opportunity */}
      <MultipleChoiceQuestion
        question="How would you describe the opportunity for growth and development within your organization?"
        options={[
          { value: "no_path", label: "There’s no clear path — we figure it out on our own" },
          { value: "some_guidance", label: "Some guidance — depends on your manager" },
          { value: "structured_support", label: "We offer structured support or mentorship" },
          { value: "clear_pathways", label: "Clear development pathways for all roles" },
        ]}
        value={getStringAnswer(answers["growth_opportunity"])}
        onChange={(val) => onAnswer("growth_opportunity", val)}
      />
    </div>
  );
}
