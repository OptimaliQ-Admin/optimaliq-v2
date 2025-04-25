"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["which_4b594c"]) &&
    answers["which_4b594c"].length > 0 &&
    typeof answers["what’s_a7967d"] === "string" &&
    answers["what’s_a7967d"].trim().length > 0 &&
    typeof answers["how_c8eb2a"] === "string" &&
    answers["how_c8eb2a"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  const bottlenecks = answers["which_4b594c"] || [];

  return (
    <div className="space-y-10">

      {/* Question 8: which_4b594c */}
      <MultiSelectQuestion
        question="Which of the following bottlenecks do you encounter most often in your sales process?"
        options={[
          { value: "Leads_go_cold", label: "Leads go cold" },
          { value: "Prospects_ghost_after_demos", label: "Prospects ghost after demos" },
          { value: "Proposals_get_stuck", label: "Proposals get stuck" },
          { value: "Pricing_objections", label: "Pricing objections" },
          { value: "Internal_delays_or_handoffs", label: "Internal delays or handoffs" },
        ]}
        selected={Array.isArray(getArrayAnswer(bottlenecks)) ? getArrayAnswer(bottlenecks) : []}
        onChange={(val) => onAnswer("which_4b594c", val)}
        maxSelect={5}
      />

      {/* Question 9: what’s_a7967d */}
      <TextAreaQuestion
        question="What’s one part of your pipeline that feels unpredictable or messy?"
        placeholder="E.g., qualification, handoffs, or late-stage follow-ups"
        value={getStringAnswer(answers["what’s_a7967d"])}
        onChange={(val) => onAnswer("what’s_a7967d", val)}
        maxLength={300}
      />

      {/* Question 10: how_c8eb2a */}
      <MultipleChoiceQuestion
        question="How do you handle leads that don’t convert right away?"
        options={[
          { value: "We_dont_follow_up", label: "We don’t follow up" },
          { value: "We_manually_reach_out_when_we_remember", label: "We manually reach out when we remember" },
          { value: "We_schedule_follow_ups", label: "We schedule follow-ups" },
          { value: "We_place_them_into_nurture_or_remarketing_flows", label: "We place them into nurture or remarketing flows" },
        ]}
        value={getStringAnswer(answers["how_c8eb2a"])}
        onChange={(val) => onAnswer("how_c8eb2a", val)}
      />
    </div>
  );
}
