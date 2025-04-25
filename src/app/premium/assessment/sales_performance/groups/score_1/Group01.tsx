"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_b5d8e7"] === "string" &&
    typeof answers["do_b7cc0a"] === "string" &&
    typeof answers["how_fee95e"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How do you currently generate new sales leads or opportunities?"
        options={[
          { value: "Referrals_and_word_of_mouth", label: "Referrals and word-of-mouth" },
          { value: "Occasional_outreach_or_events", label: "Occasional outreach or events" },
          { value: "Website_or_social_media_inquiries", label: "Website or social media inquiries" },
          { value: "We_dont_have_a_consistent_method", label: "We don’t have a consistent method" },
        ]}
        value={getStringAnswer(answers["how_b5d8e7"])}
        onChange={(val) => onAnswer("how_b5d8e7", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="Do you have a defined sales process or set of steps that your team follows?"
        options={[
          { value: "No_process___each_sale_is_different", label: "No process — each sale is different" },
          { value: "We_follow_a_loose_outline", label: "We follow a loose outline" },
          { value: "We_have_a_few_key_steps_we_try_to_follow", label: "We have a few key steps we try to follow" },
          { value: "Yes___we_use_a_defined_process_from_lead_to_close", label: "Yes — we use a defined process from lead to close" },
        ]}
        value={getStringAnswer(answers["do_b7cc0a"])}
        onChange={(val) => onAnswer("do_b7cc0a", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How do you currently track your sales pipeline?"
        options={[
          { value: "We_dont_track_it", label: "We don’t track it" },
          { value: "Manually_in_a_spreadsheet", label: "Manually in a spreadsheet" },
          { value: "In_a_basic_CRM_eg_HubSpot_Salesforce", label: "In a basic CRM (e.g. HubSpot, Salesforce)" },
          { value: "In_a_structured_system_with_deal_stages_and_forecasts", label: "In a structured system with deal stages and forecasts" },
        ]}
        value={getStringAnswer(answers["how_fee95e"])}
        onChange={(val) => onAnswer("how_fee95e", val)}
      />
    </div>
  );
}
