"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group04_GrowthStack({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 10: Acquisition Channels */}
      <MultiSelectQuestion
        question="Which acquisition channels are driving meaningful results today?"
        description="Select all that apply."
        options={[
          { value: "seo", label: "Organic Search / SEO" },
          { value: "paid_media", label: "Paid Media (Google, Meta, TikTok, etc.)" },
          { value: "email", label: "Email Marketing" },
          { value: "outbound", label: "Outbound Sales" },
          { value: "partnerships", label: "Partnerships / Affiliates" },
          { value: "events", label: "Events / Webinars" },
          { value: "influencers", label: "Influencer Marketing" },
          { value: "pr", label: "PR / Earned Media" },
          { value: "referrals", label: "Word of Mouth / Referrals" },
          { value: "retail", label: "Retail or Channel Distribution" },
          { value: "other", label: "Other (please describe)" },
        ]}
        selected={answers["acquisition_channels"] || []}
        onChange={(val) => onAnswer("acquisition_channels", val)}
        maxSelect={6}
      />

      {/* Question 11: Tech Maturity */}
      <MultipleChoiceQuestion
        question="What is your current tech maturity level?"
        description="How well-integrated and effective is your current tech stack?"
        options={[
          { value: "integrated", label: "Everything is integrated and works seamlessly" },
          { value: "partially_integrated", label: "Some systems talk to each other, others don’t" },
          { value: "siloed", label: "Tools are siloed or require manual workarounds" },
          { value: "early_stage", label: "We’re still selecting or onboarding core platforms" },
          { value: "unsure", label: "Unsure / Other" },
        ]}
        value={answers["tech_maturity"] || ""}
        onChange={(val) => onAnswer("tech_maturity", val)}
      />

      {/* Question 12: Retention Strategy */}
      <TextAreaQuestion
        question="What are your current retention levers?"
        description="How do you keep customers coming back? What’s your hook or lifecycle play?"
        placeholder="E.g., Email drip campaigns, customer success outreach, loyalty programs..."
        value={answers["retention_strategy"] || ""}
        onChange={(val) => onAnswer("retention_strategy", val)}
        maxLength={300}
      />
    </div>
  );
}
