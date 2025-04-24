"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_initiatives"] === "string" &&
    typeof answers["cross_functional_alignment"] === "string" &&
    typeof answers["goal_evaluation"] === "string" &&
    typeof answers["kpi_integration"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How do you structure and execute major strategic initiatives?"
        options={[
          { value: "ad_hoc", label: "Ad hoc with limited accountability" },
          { value: "assigned", label: "Assigned owners with check-ins" },
          { value: "program_management", label: "Managed as formal programs" },
          { value: "integrated_portfolio", label: "Integrated portfolio with executive steering" },
        ]}
        value={getStringAnswer(answers["strategic_initiatives"])}
        onChange={(val) => onAnswer("strategic_initiatives", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How aligned are different departments when executing strategy?"
        options={[
          { value: "mostly_siloed", label: "Mostly siloed with individual priorities" },
          { value: "loosely_coordinated", label: "Loosely coordinated through meetings" },
          { value: "generally_aligned", label: "Generally aligned with shared objectives" },
          { value: "fully_integrated", label: "Fully integrated with joint ownership" },
        ]}
        value={getStringAnswer(answers["cross_functional_alignment"])}
        onChange={(val) => onAnswer("cross_functional_alignment", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How often are goals and priorities reassessed?"
        options={[
          { value: "annually_only", label: "Annually, if at all" },
          { value: "quarterly", label: "Quarterly or during planning" },
          { value: "regularly_with_input", label: "Regularly with cross-team input" },
          { value: "dynamic_adjustments", label: "Dynamically based on data and feedback" },
        ]}
        value={getStringAnswer(answers["goal_evaluation"])}
        onChange={(val) => onAnswer("goal_evaluation", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How well are strategic KPIs linked to individual and team performance?"
        options={[
          { value: "not_tracked", label: "They’re not really tracked" },
          { value: "basic_reporting", label: "We report them but don’t use them well" },
          { value: "reviewed_with_goals", label: "Reviewed and tied to some goals" },
          { value: "fully_integrated", label: "Fully integrated into performance reviews" },
        ]}
        value={getStringAnswer(answers["kpi_integration"])}
        onChange={(val) => onAnswer("kpi_integration", val)}
      />
    </div>
  );
}
