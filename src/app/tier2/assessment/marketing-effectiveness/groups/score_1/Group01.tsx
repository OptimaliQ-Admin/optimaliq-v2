"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["often_marketing_campaigns"] === "string" &&
    answers["often_marketing_campaigns"].trim().length > 0 &&
    typeof answers["customers_find_business"] === "string" &&
    answers["customers_find_business"].trim().length > 0 &&
    typeof answers["ideal_customer_picture"] === "string" &&
    answers["ideal_customer_picture"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How often do you run marketing campaigns to promote your business?"
        options={[
          { value: "We don’t run any campaigns", label: "We don’t run any campaigns" },
          { value: "Occasionally, when we have time", label: "Occasionally, when we have time" },
          { value: "A few times a year", label: "A few times a year" },
          { value: "We run them monthly or more", label: "We run them monthly or more" }
        ]}
        value={answers["often_marketing_campaigns"] || ""}
        onChange={(val) => onAnswer("often_marketing_campaigns", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="What is the main way customers currently find your business?"
        options={[
          { value: "Referrals or word of mouth", label: "Referrals or word of mouth" },
          { value: "Social media or local events", label: "Social media or local events" },
          { value: "Paid ads or promotions", label: "Paid ads or promotions" },
          { value: "Organic search or inbound content", label: "Organic search or inbound content" }
        ]}
        value={answers["customers_find_business"] || ""}
        onChange={(val) => onAnswer("customers_find_business", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="Do you have a clear picture of who your ideal customer is?"
        options={[
          { value: "Not really", label: "Not really" },
          { value: "We have a general idea", label: "We have a general idea" },
          { value: "We have some customer personas", label: "We have some customer personas" },
          { value: "Yes, we've documented and validated them", label: "Yes, we've documented and validated them" }
        ]}
        value={answers["ideal_customer_picture"] || ""}
        onChange={(val) => onAnswer("ideal_customer_picture", val)}
      />
    </div>
  );
}
