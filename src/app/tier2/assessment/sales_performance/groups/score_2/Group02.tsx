"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["follow_up_tracking"] === "string" &&
    answers["follow_up_tracking"].trim().length > 0 &&
    Array.isArray(answers["sales_routines"]) &&
    answers["sales_routines"].length > 0 &&
    typeof answers["meeting_prep"] === "string" &&
    answers["meeting_prep"].trim().length > 0 &&
    typeof answers["call_documentation"] === "string" &&
    answers["call_documentation"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  const selectedRoutines = answers["sales_routines"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: follow_up_tracking */}
      <MultipleChoiceQuestion
        question="How do you track and manage follow-ups across deals?"
        options={[
          { value: "no_tracking", label: "We don’t track follow-ups well" },
          { value: "rep_managed", label: "We rely on reps to manage it manually" },
          { value: "systematic", label: "We have a systematic way (e.g., tasks, playbooks)" },
          { value: "fully_automated", label: "We use automation and alerts for follow-ups" },
        ]}
        value={answers["follow_up_tracking"] || ""}
        onChange={(val) => onAnswer("follow_up_tracking", val)}
      />

      {/* Question 5: sales_routines */}
      <MultiSelectQuestion
        question="Which of the following are part of your sales team's routines?"
        options={[
          { value: "pipeline_reviews", label: "Regular pipeline reviews" },
          { value: "forecasting_reports", label: "Forecasting reports" },
          { value: "team_huddles", label: "Team huddles or deal strategy sessions" },
          { value: "collab_with_cs", label: "Collaboration with Customer Success or Marketing" },
          { value: "none", label: "None of these are consistent" },
        ]}
        selected={selectedRoutines}
        onChange={(val) => onAnswer("sales_routines", val)}
        maxSelect={5}
      />

      {/* Question 6: meeting_prep */}
      <MultipleChoiceQuestion
        question="How do you typically prepare for a sales meeting?"
        options={[
          { value: "wing_it", label: "We wing it" },
          { value: "quick_review", label: "We glance at past notes or emails" },
          { value: "research_plus_notes", label: "We review notes and do some research" },
          { value: "formal_plan", label: "We have a prep doc or battlecard for each meeting" },
        ]}
        value={answers["meeting_prep"] || ""}
        onChange={(val) => onAnswer("meeting_prep", val)}
      />

      {/* Question 7: call_documentation */}
      <MultipleChoiceQuestion
        question="How often are sales conversations documented or summarized?"
        options={[
          { value: "rarely", label: "Rarely" },
          { value: "big_deals_only", label: "Only for big deals" },
          { value: "most_calls", label: "Most calls are logged or documented" },
          { value: "always_logged", label: "Everything is logged with context and notes" },
        ]}
        value={answers["call_documentation"] || ""}
        onChange={(val) => onAnswer("call_documentation", val)}
      />
    </div>
  );
}
