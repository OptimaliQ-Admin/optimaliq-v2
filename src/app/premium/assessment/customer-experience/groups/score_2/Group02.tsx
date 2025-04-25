"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_journey_mapping"] === "string" &&
    typeof answers["channel_consistency"] === "string" &&
    typeof answers["cx_process_documentation"] === "string" &&
    typeof answers["feedback_action"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score_2_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: customer_journey_mapping */}
      <MultipleChoiceQuestion
        question="Have you mapped out the full customer journey across touchpoints?"
        options={[
          { value: "not_mapped", label: "No, we haven’t mapped it" },
          { value: "basic_map", label: "We have a basic or partial map" },
          { value: "comprehensive_map", label: "We have a comprehensive journey map" },
          { value: "used_for_decision_making", label: "Yes, and it informs our decision-making" },
        ]}
        value={getStringAnswer(answers["customer_journey_mapping"])}
        onChange={(val) => onAnswer("customer_journey_mapping", val)}
      />

      {/* Question 5: channel_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is your customer experience across different channels (email, social, chat, etc.)?"
        options={[
          { value: "very_inconsistent", label: "Very inconsistent — depends on the channel" },
          { value: "somewhat_consistent", label: "Somewhat consistent — we aim for similar tone and response times" },
          { value: "mostly_consistent", label: "Mostly consistent with a unified approach" },
          { value: "fully_consistent", label: "Fully consistent — it's intentionally designed" },
        ]}
        value={getStringAnswer(answers["channel_consistency"])}
        onChange={(val) => onAnswer("channel_consistency", val)}
      />

      {/* Question 6: cx_process_documentation */}
      <MultipleChoiceQuestion
        question="How well documented are your customer service or experience processes?"
        options={[
          { value: "not_documented", label: "Not documented at all" },
          { value: "partially_documented", label: "Some things are written down" },
          { value: "mostly_documented", label: "Mostly documented and referenced" },
          { value: "fully_documented", label: "Fully documented with regular updates" },
        ]}
        value={getStringAnswer(answers["cx_process_documentation"])}
        onChange={(val) => onAnswer("cx_process_documentation", val)}
      />

      {/* Question 7: feedback_action */}
      <MultipleChoiceQuestion
        question="How often do you take action based on customer feedback?"
        options={[
          { value: "rarely", label: "Rarely — we collect it but don’t act on it" },
          { value: "sometimes", label: "Sometimes — we make ad hoc improvements" },
          { value: "regularly", label: "Regularly — feedback informs process or product changes" },
          { value: "systematic", label: "Systematic — feedback drives continuous improvement" },
        ]}
        value={getStringAnswer(answers["feedback_action"])}
        onChange={(val) => onAnswer("feedback_action", val)}
      />
    </div>
  );
}
