"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_kpi_review"] === "string" &&
    typeof answers["team_strategy_understanding"] === "string" &&
    typeof answers["scenario_planning_frequency"] === "string" &&
    typeof answers["feedback_to_strategy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How often do you review KPIs or OKRs related to strategic goals?"
        options={[
          { value: "rarely_reviewed", label: "Rarely — they’re mostly static" },
          { value: "annually", label: "Annually during planning" },
          { value: "quarterly_check_ins", label: "Quarterly check-ins" },
          { value: "monthly_tracking", label: "Monthly or more frequent tracking" },
        ]}
        value={getStringAnswer(answers["strategic_kpi_review"])}
        onChange={(val) => onAnswer("strategic_kpi_review", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How well does your team understand how their work supports the strategic plan?"
        options={[
          { value: "unclear_connection", label: "Unclear or disconnected" },
          { value: "somewhat_aligned", label: "Somewhat aligned" },
          { value: "mostly_aligned", label: "Mostly aligned" },
          { value: "fully_aligned", label: "Fully aligned and purpose-driven" },
        ]}
        value={getStringAnswer(answers["team_strategy_understanding"])}
        onChange={(val) => onAnswer("team_strategy_understanding", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How often do you engage in scenario planning or future-back strategy work?"
        options={[
          { value: "never", label: "Never — we focus on the present" },
          { value: "yearly", label: "Yearly as part of planning" },
          { value: "twice_per_year", label: "Twice per year" },
          { value: "frequent", label: "Frequently — it’s a core practice" },
        ]}
        value={getStringAnswer(answers["scenario_planning_frequency"])}
        onChange={(val) => onAnswer("scenario_planning_frequency", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How often do insights or learnings from teams reshape your strategy?"
        options={[
          { value: "never", label: "Rarely — strategy is fixed" },
          { value: "sometimes", label: "Sometimes — if leadership sees value" },
          { value: "frequently", label: "Frequently — we adapt based on input" },
          { value: "continuous_loop", label: "Always — feedback loops are built in" },
        ]}
        value={getStringAnswer(answers["feedback_to_strategy"])}
        onChange={(val) => onAnswer("feedback_to_strategy", val)}
      />
    </div>
  );
}
