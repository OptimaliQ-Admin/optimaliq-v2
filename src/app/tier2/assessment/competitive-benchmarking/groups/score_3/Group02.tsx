"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["internal_benchmarking"] === "string" &&
    typeof answers["benchmarking_use"] === "string" &&
    typeof answers["decision_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 5: internal_benchmarking */}
      <MultipleChoiceQuestion
        question="How often do you compare performance between teams, regions, or time periods?"
        options={[
          { value: "never", label: "We don’t really do this" },
          { value: "occasionally", label: "Occasionally — during planning or reviews" },
          { value: "regularly", label: "Regularly — as part of operations" },
          { value: "continuously", label: "Continuously — it’s a core part of our ops culture" },
        ]}
        value={answers["internal_benchmarking"] || ""}
        onChange={(val) => onAnswer("internal_benchmarking", val)}
      />

      {/* Question 6: benchmarking_use */}
      <MultipleChoiceQuestion
        question="How do you use benchmarking data?"
        options={[
          { value: "we_dont_use", label: "We don’t really use it" },
          { value: "for_reporting", label: "We share it in reports or dashboards" },
          { value: "for_discussion", label: "We use it to spark discussion or analysis" },
          { value: "for_action", label: "We use it to shape priorities and actions" },
        ]}
        value={answers["benchmarking_use"] || ""}
        onChange={(val) => onAnswer("benchmarking_use", val)}
      />

      {/* Question 7: decision_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your key decisions (marketing, product, GTM) with what the data says?"
        options={[
          { value: "not_aligned", label: "Not really aligned" },
          { value: "loosely_aligned", label: "Loosely aligned — data is reviewed but not decisive" },
          { value: "mostly_aligned", label: "Mostly aligned — data shapes most decisions" },
          { value: "fully_aligned", label: "Fully aligned — decisions are based on clear data signals" },
        ]}
        value={answers["decision_alignment"] || ""}
        onChange={(val) => onAnswer("decision_alignment", val)}
      />
    </div>
  );
}
