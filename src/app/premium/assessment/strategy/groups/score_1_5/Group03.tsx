"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["team_focus"] === "string" &&
    typeof answers["strategy_adjustment"] === "string" &&
    typeof answers["long_term_thinking"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="How well do team goals and work align to the company’s strategy?"
        options={[
          { value: "no_alignment", label: "Not at all — strategy and execution are disconnected" },
          { value: "partial_alignment", label: "Some teams are aligned, others are not" },
          { value: "mostly_aligned", label: "Most work maps back to strategic goals" },
          { value: "fully_aligned", label: "Everyone understands how their work contributes" },
        ]}
        value={getStringAnswer(answers["team_focus"])}
        onChange={(val) => onAnswer("team_focus", val)}
      />

      <MultipleChoiceQuestion
        question="How easily can your business adjust strategy when needed?"
        options={[
          { value: "very_difficult", label: "Very difficult — it takes months and causes confusion" },
          { value: "somewhat_difficult", label: "Somewhat difficult — we can pivot but it’s slow" },
          { value: "moderately_agile", label: "Moderately agile — we can shift with effort" },
          { value: "very_agile", label: "Very agile — we’re built for adaptation" },
        ]}
        value={getStringAnswer(answers["strategy_adjustment"])}
        onChange={(val) => onAnswer("strategy_adjustment", val)}
      />

      <MultipleChoiceQuestion
        question="How much of your leadership team’s time is spent on long-term strategy?"
        options={[
          { value: "none", label: "None — we’re focused entirely on short-term goals" },
          { value: "little", label: "A little — most time is spent firefighting" },
          { value: "some", label: "Some — we dedicate regular time to long-term thinking" },
          { value: "a_lot", label: "A lot — strategic foresight is part of leadership culture" },
        ]}
        value={getStringAnswer(answers["long_term_thinking"])}
        onChange={(val) => onAnswer("long_term_thinking", val)}
      />
    </div>
  );
}
