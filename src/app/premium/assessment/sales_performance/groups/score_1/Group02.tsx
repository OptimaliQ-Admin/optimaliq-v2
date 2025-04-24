"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["who_5d9558"] === "string" &&
    typeof answers["how_454fc5"] === "string" &&
    typeof answers["which_01150c"] === "string" &&
    Array.isArray(answers["which_6a5924"]) &&
    answers["which_6a5924"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  const tracked = answers["which_6a5924"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: who_5d9558 */}
      <MultipleChoiceQuestion
        question="Who in your organization is responsible for closing deals?"
        options={[
          { value: "The_founder_or_owner", label: "The founder or owner" },
          { value: "One_salesperson", label: "One salesperson" },
          { value: "A_small_team", label: "A small team" },
          { value: "A_dedicated_structured_sales_department", label: "A dedicated, structured sales department" },
        ]}
        value={getStringAnswer(answers["who_5d9558"])}
        onChange={(val) => onAnswer("who_5d9558", val)}
      />

      {/* Question 5: how_454fc5 */}
      <MultipleChoiceQuestion
        question="How consistently do you follow up with leads or prospects?"
        options={[
          { value: "Inconsistently_or_not_at_all", label: "Inconsistently or not at all" },
          { value: "We_try_but_sometimes_forget", label: "We try, but sometimes forget" },
          { value: "We_have_a_basic_reminder_system", label: "We have a basic reminder system" },
          { value: "We_have_automated_or_scheduled_follow_ups", label: "We have automated or scheduled follow-ups" },
        ]}
        value={getStringAnswer(answers["how_454fc5"])}
        onChange={(val) => onAnswer("how_454fc5", val)}
      />

      {/* Question 6: which_01150c */}
      <MultipleChoiceQuestion
        question="Which of the following best describes how you qualify leads?"
        options={[
          { value: "We_talk_to_anyone_interested", label: "We talk to anyone interested" },
          { value: "We_ask_a_few_questions_during_discovery", label: "We ask a few questions during discovery" },
          { value: "We_use_basic_criteria_eg_budget_need", label: "We use basic criteria (e.g. budget, need)" },
          { value: "We_follow_a_lead_scoring_or_qualification_framework", label: "We follow a lead scoring or qualification framework" },
        ]}
        value={getStringAnswer(answers["which_01150c"])}
        onChange={(val) => onAnswer("which_01150c", val)}
      />

      {/* Question 7: which_6a5924 */}
      <MultiSelectQuestion
        question="Which of the following do you currently track or measure in your sales process?"
        options={[
          { value: "Lead_sources", label: "Lead sources" },
          { value: "Deal_stage_conversion_rates", label: "Deal stage conversion rates" },
          { value: "Time_to_close", label: "Time to close" },
          { value: "Win_loss_reasons", label: "Win/loss reasons" },
          { value: "Sales_activity_calls_emails", label: "Sales activity (calls, emails)" },
        ]}
        selected={tracked}
        onChange={(val) => onAnswer("which_6a5924", val)}
        maxSelect={5}
      />
    </div>
  );
}
