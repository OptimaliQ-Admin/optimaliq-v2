"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["what_fed657"]) &&
    answers["what_fed657"].length > 0 &&
    typeof answers["what’s_4abcc8"] === "string" &&
    answers["what’s_4abcc8"].trim().length > 0 &&
    typeof answers["how_8e4ef6"] === "string" &&
    answers["how_8e4ef6"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  const tools = answers["what_fed657"] || [];

  return (
    <div className="space-y-10">

      {/* Question 8: what_fed657 */}
      <MultiSelectQuestion
        question="What systems or tools do you use to coach reps based on performance data?"
        options={[
          { value: "spreadsheets", label: "1:1 notes or spreadsheets" },
          { value: "crm_dashboards", label: "CRM dashboards" },
          { value: "call_review", label: "Call review tools (Gong, Chorus)" },
          { value: "coaching_platforms", label: "Coaching platforms or frameworks" },
          { value: "sales_scorecards", label: "Sales scorecards" },
        ]}
        selected={tools}
        onChange={(val) => onAnswer("what_fed657", val)}
        maxSelect={5}
      />

      {/* Question 9: what’s_4abcc8 */}
      <TextAreaQuestion
        question="What’s one area of your sales process you’d automate or streamline next?"
        placeholder="E.g., follow-ups, stage updates, reminders"
        value={answers["what’s_4abcc8"] || ""}
        onChange={(val) => onAnswer("what’s_4abcc8", val)}
        maxLength={300}
      />

      {/* Question 10: how_8e4ef6 */}
      <MultipleChoiceQuestion
        question="How confident are you in your sales team’s ability to hit stretch revenue targets over the next two quarters?"
        options={[
          { value: "not_confident", label: "Not confident — we’re behind or unclear" },
          { value: "somewhat", label: "Somewhat — we’re working toward it" },
          { value: "confident", label: "Confident — we have the pipeline and systems" },
          { value: "very_confident", label: "Very confident — we’re already forecasting upside" },
        ]}
        value={answers["how_8e4ef6"] || ""}
        onChange={(val) => onAnswer("how_8e4ef6", val)}
      />
    </div>
  );
}
