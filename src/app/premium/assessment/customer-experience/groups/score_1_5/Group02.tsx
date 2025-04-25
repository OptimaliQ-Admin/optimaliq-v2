"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_follow_up"] === "string" &&
    typeof answers["customer_journey_mapping"] === "string" &&
    typeof answers["satisfaction_insights"] === "string" &&
    typeof answers["customer_feedback_channel"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score_1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: customer_follow_up */}
      <MultipleChoiceQuestion
        question="What’s your typical process after a customer has a negative experience?"
        options={[
          { value: "no_process", label: "We don’t really have a follow-up process" },
          { value: "case_by_case", label: "Handled case-by-case depending on the agent" },
          { value: "some_guidelines", label: "We have guidelines but no automation" },
          { value: "proactive_recovery", label: "We follow structured recovery workflows" },
        ]}
        value={getStringAnswer(answers["customer_follow_up"])}
        onChange={(val) => onAnswer("customer_follow_up", val)}
      />

      {/* Question 5: customer_journey_mapping */}
      <MultipleChoiceQuestion
        question="Do you have a clear map of your customer journey stages?"
        options={[
          { value: "no_journey_map", label: "No — we’ve never mapped it" },
          { value: "loose_idea", label: "We have a loose idea of the journey" },
          { value: "basic_map", label: "We’ve mapped a basic journey with key touchpoints" },
          { value: "full_map", label: "Yes — we have a detailed, strategic customer journey map" },
        ]}
        value={getStringAnswer(answers["customer_journey_mapping"])}
        onChange={(val) => onAnswer("customer_journey_mapping", val)}
      />

      {/* Question 6: satisfaction_insights */}
      <MultipleChoiceQuestion
        question="How do you measure customer satisfaction today?"
        options={[
          { value: "no_tracking", label: "We don’t track satisfaction" },
          { value: "occasional_reviews", label: "We look at reviews or complaints occasionally" },
          { value: "basic_surveys", label: "We run surveys or feedback forms occasionally" },
          { value: "ongoing_tracking", label: "We track satisfaction consistently and review it regularly" },
        ]}
        value={getStringAnswer(answers["satisfaction_insights"])}
        onChange={(val) => onAnswer("satisfaction_insights", val)}
      />

      {/* Question 7: customer_feedback_channel */}
      <MultipleChoiceQuestion
        question="Where does most of your customer feedback come from?"
        options={[
          { value: "we_dont_collect", label: "We don’t actively collect feedback" },
          { value: "inbound_support", label: "It comes through support channels or complaints" },
          { value: "surveys_or_nps", label: "We send surveys or track NPS after interactions" },
          { value: "multiple_feedback_loops", label: "We gather feedback through multiple structured methods" },
        ]}
        value={getStringAnswer(answers["customer_feedback_channel"])}
        onChange={(val) => onAnswer("customer_feedback_channel", val)}
      />
    </div>
  );
}
