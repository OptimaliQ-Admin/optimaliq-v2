"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["performance_vs_competitors"] === "string" &&
    typeof answers["competitive_edge_source"] === "string" &&
    typeof answers["market_position_clarity"] === "string" &&
    typeof answers["brand_perception_tracking"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_1_9_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: performance_vs_competitors */}
      <MultipleChoiceQuestion
        question="How do you currently compare your business performance to competitors?"
        options={[
          { value: "don’t_compare", label: "We don’t really compare performance" },
          { value: "based_on_sales", label: "We look at sales or revenue alone" },
          { value: "basic_metrics", label: "We consider a few basic benchmarks" },
          { value: "comprehensive", label: "We use comprehensive benchmarking data" },
        ]}
        value={answers["performance_vs_competitors"] || ""}
        onChange={(val) => onAnswer("performance_vs_competitors", val)}
      />

      {/* Question 5: competitive_edge_source */}
      <MultipleChoiceQuestion
        question="Where does your business currently gain a competitive edge?"
        options={[
          { value: "pricing", label: "Pricing" },
          { value: "customer_service", label: "Customer service" },
          { value: "product_quality", label: "Product or service quality" },
          { value: "not_sure", label: "Not sure or nothing stands out" },
        ]}
        value={answers["competitive_edge_source"] || ""}
        onChange={(val) => onAnswer("competitive_edge_source", val)}
      />

      {/* Question 6: market_position_clarity */}
      <MultipleChoiceQuestion
        question="How clearly do you communicate your market position?"
        options={[
          { value: "not_clearly", label: "Not clearly at all" },
          { value: "somewhat_clear", label: "Somewhat clear in messaging" },
          { value: "usually_clear", label: "Usually clear in most materials" },
          { value: "very_clear", label: "Very clear and aligned across channels" },
        ]}
        value={answers["market_position_clarity"] || ""}
        onChange={(val) => onAnswer("market_position_clarity", val)}
      />

      {/* Question 7: brand_perception_tracking */}
      <MultipleChoiceQuestion
        question="Do you actively track brand perception or reputation?"
        options={[
          { value: "not_at_all", label: "Not at all" },
          { value: "informally", label: "Informally (e.g. social media feedback)" },
          { value: "periodically", label: "Yes, we collect some data periodically" },
          { value: "consistently", label: "Yes, with consistent reputation metrics" },
        ]}
        value={answers["brand_perception_tracking"] || ""}
        onChange={(val) => onAnswer("brand_perception_tracking", val)}
      />
    </div>
  );
}
