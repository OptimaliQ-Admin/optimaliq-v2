"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_a76658"] === "string" &&
    answers["how_a76658"].trim().length > 0 &&
    Array.isArray(answers["which_045862"]) &&
    answers["which_045862"].length > 0 &&
    typeof answers["how_5589a0"] === "string" &&
    answers["how_5589a0"].trim().length > 0 &&
    typeof answers["how_92a11d"] === "string" &&
    answers["how_92a11d"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  const selectedOps = answers["which_045862"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: how_a76658 */}
      <MultipleChoiceQuestion
        question="How do you track and manage follow-ups across your deals?"
        options={[
          { value: "We don’t track follow-ups well", label: "We don’t track follow-ups well" },
          { value: "We rely on calendar or reminders", label: "We rely on calendar or reminders" },
          { value: "We have tasks inside our CRM", label: "We have tasks inside our CRM" },
          { value: "We use automation or sequences to manage follow-ups", label: "We use automation or sequences to manage follow-ups" },
        ]}
        value={getStringAnswer(answers["how_a76658"])}
        onChange={(val) => onAnswer("how_a76658", val)}
      />

      {/* Question 5: which_045862 */}
      <MultiSelectQuestion
        question="Which of the following are part of your sales operations today?"
        options={[
          { value: "Regular pipeline reviews", label: "Regular pipeline reviews" },
          { value: "Forecasting reports", label: "Forecasting reports" },
          { value: "Deal stage conversion tracking", label: "Deal stage conversion tracking" },
          { value: "Sales enablement content", label: "Sales enablement content" },
          { value: "Performance dashboards", label: "Performance dashboards" },
        ]}
        selected={Array.isArray(getArrayAnswer(selectedOps)) ? getArrayAnswer(selectedOps) : []}
        onChange={(val) => onAnswer("which_045862", val)}
        maxSelect={5}
      />

      {/* Question 6: how_5589a0 */}
      <MultipleChoiceQuestion
        question="How do you typically prepare for a sales meeting or call?"
        options={[
          { value: "We wing it", label: "We wing it" },
          { value: "We glance at past notes or emails", label: "We glance at past notes or emails" },
          { value: "We follow a checklist or sales script", label: "We follow a checklist or sales script" },
          { value: "We prep with research, context, and a discovery framework", label: "We prep with research, context, and a discovery framework" },
        ]}
        value={getStringAnswer(answers["how_5589a0"])}
        onChange={(val) => onAnswer("how_5589a0", val)}
      />

      {/* Question 7: how_92a11d */}
      <MultipleChoiceQuestion
        question="How often are sales conversations documented or logged?"
        options={[
          { value: "Rarely", label: "Rarely" },
          { value: "Only for big deals", label: "Only for big deals" },
          { value: "Most calls are noted in the CRM", label: "Most calls are noted in the CRM" },
          { value: "Every interaction is logged and searchable", label: "Every interaction is logged and searchable" },
        ]}
        value={getStringAnswer(answers["how_92a11d"])}
        onChange={(val) => onAnswer("how_92a11d", val)}
      />
    </div>
  );
}
