"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["kpi_transparency"] === "string" &&
    typeof answers["empowerment_level"] === "string" &&
    typeof answers["long_term_focus"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 8: kpi_transparency */}
      <MultipleChoiceQuestion
        question="How transparent are strategic KPIs across your company?"
        options={[
          { value: "not_shared", label: "They are not shared with the broader team" },
          { value: "some_visibility", label: "Some visibility for department heads" },
          { value: "available_on_request", label: "Available on request or in dashboards" },
          { value: "fully_transparent", label: "Fully transparent and discussed regularly" },
        ]}
        value={getStringAnswer(answers["kpi_transparency"])}
        onChange={(val) => onAnswer("kpi_transparency", val)}
      />

      {/* Question 9: empowerment_level */}
      <MultipleChoiceQuestion
        question="How empowered are frontline teams to make decisions aligned with strategy?"
        options={[
          { value: "not_empowered", label: "Not at all — everything goes through leadership" },
          { value: "minor_input", label: "They have some input but limited decision rights" },
          { value: "clear_guidance", label: "They follow clear guidance to make decisions" },
          { value: "fully_empowered", label: "They’re fully empowered within strategic boundaries" },
        ]}
        value={getStringAnswer(answers["empowerment_level"])}
        onChange={(val) => onAnswer("empowerment_level", val)}
      />

      {/* Question 10: long_term_focus */}
      <MultipleChoiceQuestion
        question="How much focus is placed on long-term strategic goals versus short-term wins?"
        options={[
          { value: "mostly_short_term", label: "Mostly focused on short-term wins" },
          { value: "occasional_long_term", label: "Some long-term initiatives get attention" },
          { value: "balanced_focus", label: "A good balance of short- and long-term" },
          { value: "long_term_driven", label: "Strategy is long-term driven with short-term milestones" },
        ]}
        value={getStringAnswer(answers["long_term_focus"])}
        onChange={(val) => onAnswer("long_term_focus", val)}
      />
    </div>
  );
}
