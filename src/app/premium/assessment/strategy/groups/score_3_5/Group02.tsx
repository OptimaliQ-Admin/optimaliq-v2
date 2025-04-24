"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["progress_tracking_method"] === "string" &&
    typeof answers["course_correction"] === "string" &&
    typeof answers["communication_frequency"] === "string" &&
    typeof answers["strategy_meeting_cadence"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: progress_tracking_method */}
      <MultipleChoiceQuestion
        question="How do you track progress against strategic goals?"
        options={[
          { value: "not_tracked", label: "We don’t have a system for tracking progress" },
          { value: "basic_spreadsheets", label: "Basic spreadsheets or informal updates" },
          { value: "scorecards_dashboards", label: "Scorecards or dashboards for major goals" },
          { value: "automated_reporting", label: "Automated reporting with regular reviews" },
        ]}
        value={answers["progress_tracking_method"] || ""}
        onChange={(val) => onAnswer("progress_tracking_method", val)}
      />

      {/* Question 5: course_correction */}
      <MultipleChoiceQuestion
        question="What happens when you're not on track to meet a strategic objective?"
        options={[
          { value: "ignored", label: "It’s usually ignored until it becomes urgent" },
          { value: "reactive_changes", label: "We make reactive changes to try and catch up" },
          { value: "discussion_then_action", label: "We discuss root causes and adjust course" },
          { value: "proactive_adjustment", label: "We proactively adjust plans and resources" },
        ]}
        value={answers["course_correction"] || ""}
        onChange={(val) => onAnswer("course_correction", val)}
      />

      {/* Question 6: communication_frequency */}
      <MultipleChoiceQuestion
        question="How frequently is strategic progress communicated to employees?"
        options={[
          { value: "never", label: "Never — it stays at the leadership level" },
          { value: "once_per_year", label: "Once per year or during planning" },
          { value: "quarterly_updates", label: "Quarterly updates or all-hands" },
          { value: "regular_open_communication", label: "Regular updates — strategy is part of the culture" },
        ]}
        value={answers["communication_frequency"] || ""}
        onChange={(val) => onAnswer("communication_frequency", val)}
      />

      {/* Question 7: strategy_meeting_cadence */}
      <MultipleChoiceQuestion
        question="What’s the cadence for your strategic planning meetings?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — when something big happens" },
          { value: "annual_only", label: "Once a year during planning season" },
          { value: "quarterly", label: "Quarterly check-ins and reviews" },
          { value: "monthly_ongoing", label: "Monthly or ongoing discussions" },
        ]}
        value={answers["strategy_meeting_cadence"] || ""}
        onChange={(val) => onAnswer("strategy_meeting_cadence", val)}
      />
    </div>
  );
}
