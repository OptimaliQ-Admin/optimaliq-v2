"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["frequency_of_reviews"] === "string" &&
    typeof answers["benchmark_team"] === "string" &&
    typeof answers["report_distribution"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: frequency_of_reviews */}
      <MultipleChoiceQuestion
        question="How often does your team review competitive benchmarks?"
        options={[
          { value: "never", label: "Never" },
          { value: "ad_hoc", label: "Ad hoc — only when needed" },
          { value: "quarterly", label: "Quarterly or as part of planning" },
          { value: "monthly_reviews", label: "Monthly or more frequently" },
        ]}
        value={answers["frequency_of_reviews"] || ""}
        onChange={(val) => onAnswer("frequency_of_reviews", val)}
      />

      {/* Question 5: benchmark_team */}
      <MultipleChoiceQuestion
        question="Who is responsible for gathering or analyzing competitive data?"
        options={[
          { value: "no_one", label: "No one owns this responsibility" },
          { value: "individual_contributors", label: "It’s done by individual team members" },
          { value: "designated_role", label: "We have a designated person or role for this" },
          { value: "dedicated_team", label: "We have a team or external firm responsible" },
        ]}
        value={answers["benchmark_team"] || ""}
        onChange={(val) => onAnswer("benchmark_team", val)}
      />

      {/* Question 6: report_distribution */}
      <MultipleChoiceQuestion
        question="What happens with the competitive insights once they’re gathered?"
        options={[
          { value: "not_shared", label: "They’re not really shared" },
          { value: "shared_on_request", label: "They’re shared if someone asks" },
          { value: "included_in_reports", label: "They’re included in periodic reports or slides" },
          { value: "shared_broadly", label: "They’re shared broadly and used in planning" },
        ]}
        value={answers["report_distribution"] || ""}
        onChange={(val) => onAnswer("report_distribution", val)}
      />
    </div>
  );
}
