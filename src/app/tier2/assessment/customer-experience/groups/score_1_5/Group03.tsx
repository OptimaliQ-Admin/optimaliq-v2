"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["support_team_consistency"] === "string" &&
    typeof answers["customer_data_access"] === "string" &&
    typeof answers["cx_initiatives"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score_1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: support_team_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is your customer support experience across channels (email, phone, chat, etc.)?"
        options={[
          { value: "very_inconsistent", label: "Very inconsistent — it depends on who you get" },
          { value: "somewhat_consistent", label: "Somewhat consistent, but with noticeable gaps" },
          { value: "mostly_consistent", label: "Mostly consistent, with occasional breakdowns" },
          { value: "very_consistent", label: "Very consistent — we follow unified guidelines and tone" },
        ]}
        value={answers["support_team_consistency"] || ""}
        onChange={(val) => onAnswer("support_team_consistency", val)}
      />

      {/* Question 9: customer_data_access */}
      <MultipleChoiceQuestion
        question="Can your team easily access customer data to personalize experiences?"
        options={[
          { value: "no_access", label: "No — data is siloed or hard to find" },
          { value: "basic_access", label: "We have access to some data, but it’s manual" },
          { value: "integrated_data", label: "Most teams can access core data across tools" },
          { value: "real_time_personalization", label: "Yes — data is integrated and accessible in real time" },
        ]}
        value={answers["customer_data_access"] || ""}
        onChange={(val) => onAnswer("customer_data_access", val)}
      />

      {/* Question 10: cx_initiatives */}
      <MultipleChoiceQuestion
        question="Which of the following best describes your approach to improving CX (customer experience)?"
        options={[
          { value: "no_cx_initiatives", label: "We haven’t really focused on CX yet" },
          { value: "reactive_cx", label: "We address CX issues as they come up" },
          { value: "some_strategic_initiatives", label: "We’ve started a few initiatives around CX" },
          { value: "proactive_cx_strategy", label: "CX is a key strategic priority with active initiatives" },
        ]}
        value={answers["cx_initiatives"] || ""}
        onChange={(val) => onAnswer("cx_initiatives", val)}
      />
    </div>
  );
}
