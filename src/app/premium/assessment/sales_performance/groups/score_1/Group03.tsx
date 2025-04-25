"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_142ca2"] === "string" &&
    typeof answers["what’s_3164b1"] === "string" &&
    typeof answers["if_4526b6"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_142ca2 */}
      <MultipleChoiceQuestion
        question="How would you describe your current approach to proposals or pricing?"
        options={[
          { value: "We_make_up_pricing_as_we_go", label: "We make up pricing as we go" },
          { value: "We_have_a_price_list_or_one_pager", label: "We have a price list or one-pager" },
          { value: "We_use_a_templated_proposal_or_quote", label: "We use a templated proposal or quote" },
          { value: "We_tailor_pricing_with_a_defined_structure", label: "We tailor pricing with a defined structure" },
        ]}
        value={getStringAnswer(answers["how_142ca2"])}
        onChange={(val) => onAnswer("how_142ca2", val)}
      />

      {/* Question 9: what’s_3164b1 */}
      <TextAreaQuestion
        question="What’s the biggest obstacle you face when trying to close more deals?"
        placeholder="E.g., high CAC, unclear process, lead quality"
        value={getStringAnswer(answers["what’s_3164b1"])}
        onChange={(val) => onAnswer("what’s_3164b1", val)}
        maxLength={300}
      />

      {/* Question 10: if_4526b6 */}
      <TextAreaQuestion
        question="If you could improve one part of your sales process today, what would it be and why?"
        placeholder="E.g., improve discovery, track deals better, reduce no-shows"
        value={getStringAnswer(answers["if_4526b6"])}
        onChange={(val) => onAnswer("if_4526b6", val)}
        maxLength={300}
      />
    </div>
  );
}
