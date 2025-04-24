"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["journey_mapping_clarity"] === "string" &&
    typeof answers["voice_of_customer_program"] === "string" &&
    typeof answers["feedback_loop_speed"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="How clearly are your customer journeys mapped across channels?"
        options={[
          { value: "not_mapped", label: "Not mapped — we rely on assumptions" },
          { value: "basic_mapping", label: "Some mapping for key touchpoints" },
          { value: "comprehensive_mapping", label: "Comprehensive mapping across most channels" },
          { value: "real_time_mapping", label: "Mapped in real-time and regularly updated" },
        ]}
        value={getStringAnswer(answers["journey_mapping_clarity"])}
        onChange={(val) => onAnswer("journey_mapping_clarity", val)}
      />

      <MultipleChoiceQuestion
        question="Do you have a formal voice of customer (VoC) program in place?"
        options={[
          { value: "none", label: "No — feedback is ad hoc" },
          { value: "informal", label: "Some structured feedback collection" },
          { value: "program", label: "Defined VoC program across teams" },
          { value: "integrated", label: "Fully integrated VoC with cross-functional usage" },
        ]}
        value={getStringAnswer(answers["voice_of_customer_program"])}
        onChange={(val) => onAnswer("voice_of_customer_program", val)}
      />

      <MultipleChoiceQuestion
        question="How quickly do you act on customer feedback or complaints?"
        options={[
          { value: "rarely_addressed", label: "Rarely addressed or slow to respond" },
          { value: "sometimes_addressed", label: "Sometimes addressed within weeks" },
          { value: "usually_addressed", label: "Usually addressed within days" },
          { value: "immediate_response", label: "Immediate response with systems/processes" },
        ]}
        value={getStringAnswer(answers["feedback_loop_speed"])}
        onChange={(val) => onAnswer("feedback_loop_speed", val)}
      />
    </div>
  );
}
